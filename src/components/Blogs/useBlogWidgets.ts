"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { createElement } from "react";
import { widgetRegistry } from "./widgets/registry";

/*
 * One hook that turns fenced code blocks in rendered blog HTML into rich
 * content, using the language tag as a router:
 *
 *   ```mermaid      → rendered as an SVG diagram (lazy mermaid import)
 *   ```<widgetKey>  → a registered React widget mounted in place
 *   anything else   → left as a normal code block
 *
 * Self-healing: React can re-apply the container's dangerouslySetInnerHTML on
 * a re-render, restoring the raw blocks after we have transformed them
 * (confirmed via stack trace: commitHostUpdate → set innerHTML). A
 * MutationObserver on the container re-runs processing whenever raw blocks
 * reappear. Processing is idempotent — once everything is converted there is
 * nothing left to match, so the observer settles.
 */

let seq = 0;

function stripInitDirective(src: string): string {
  return src.replace(/^\s*%%\{[\s\S]*?\}%%[ \t]*\r?\n?/, "");
}

function healQuotedNewlines(src: string): string {
  let out = "";
  let inQuote = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"') {
      inQuote = !inQuote;
      out += ch;
      continue;
    }
    if (inQuote && (ch === "\n" || ch === "\r")) {
      out = out.replace(/[ \t]+$/, "");
      out += "<br/>";
      while (i + 1 < src.length && (src[i + 1] === " " || src[i + 1] === "\t")) {
        i++;
      }
      continue;
    }
    out += ch;
  }
  return out;
}

const WIDGET_KEYS = Object.keys(widgetRegistry);

function hasPendingBlocks(container: HTMLElement): boolean {
  if (container.querySelector("code.language-mermaid")) return true;
  return WIDGET_KEYS.some((k) => container.querySelector(`code.language-${k}`));
}

export function useBlogWidgets(
  ref: RefObject<HTMLElement | null>,
  deps: DependencyList,
) {
  useEffect(() => {
    let cancelled = false;
    const container = ref.current;
    if (!container) return;

    // React roots created for widgets — unmounted on cleanup so a chapter or
    // content change does not leak detached trees.
    const roots: { unmount: () => void }[] = [];

    const renderMermaid = async () => {
      const pending = container.querySelectorAll<HTMLElement>(
        "code.language-mermaid",
      );
      const empties = container.querySelectorAll<HTMLElement>(
        "figure[data-mermaid-src]:empty",
      );
      if (pending.length === 0 && empties.length === 0) return;

      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      const dark = document.documentElement.classList.contains("dark");
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "neutral",
        fontFamily: "var(--font-geist-mono), monospace",
      });

      const toSvg = async (source: string): Promise<string> => {
        const clean = stripInitDirective(source);
        try {
          return (await mermaid.render(`mermaid-${seq++}`, clean)).svg;
        } catch {
          return (
            await mermaid.render(`mermaid-${seq++}`, healQuotedNewlines(clean))
          ).svg;
        }
      };

      const draw = async (target: HTMLElement, src: string) => {
        const fig = document.createElement("figure");
        fig.className = "mermaid-figure";
        fig.dataset.mermaidSrc = src;
        try {
          fig.innerHTML = await toSvg(src);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("mermaid render failed:", msg);
          fig.classList.add("mermaid-error");
          const detail = document.createElement("div");
          detail.className = "mermaid-error-msg";
          detail.textContent = `diagram failed to render — ${msg}`;
          const pre = document.createElement("pre");
          pre.textContent = src;
          fig.append(detail, pre);
        }
        if (cancelled) return;
        target.replaceWith(fig);
      };

      for (const code of pending) {
        await draw(code.closest("pre") ?? code, code.textContent ?? "");
      }
      for (const fig of empties) {
        await draw(fig, fig.dataset.mermaidSrc ?? "");
      }
    };

    const remermaidOnThemeFlip = async () => {
      const figs = container.querySelectorAll<HTMLElement>(
        "figure[data-mermaid-src]",
      );
      for (const fig of figs) fig.innerHTML = "";
      await renderMermaid();
    };

    const mountWidgets = async () => {
      for (const key of WIDGET_KEYS) {
        const blocks = container.querySelectorAll<HTMLElement>(
          `code.language-${key}`,
        );
        for (const code of blocks) {
          const target = code.closest("pre") ?? code;
          const marker = document.createElement("div");
          marker.dataset.widget = key;
          marker.dataset.props = (code.textContent ?? "").trim();
          target.replaceWith(marker);
        }
      }

      const markers = container.querySelectorAll<HTMLElement>("[data-widget]");
      if (markers.length === 0) return;

      const { createRoot } = await import("react-dom/client");
      if (cancelled) return;

      for (const marker of markers) {
        const key = marker.dataset.widget ?? "";
        if (!widgetRegistry[key]) continue;
        if (marker.childElementCount > 0) continue; // already live

        const raw = marker.dataset.props ?? "";
        let props: Record<string, unknown> = {};
        if (raw.startsWith("{")) {
          try {
            props = JSON.parse(raw);
          } catch {
            // Malformed props: render the widget with defaults.
          }
        }

        try {
          const mod = await widgetRegistry[key]();
          if (cancelled) return;
          if (marker.childElementCount > 0) continue;
          const root = createRoot(marker);
          root.render(createElement(mod.default, props));
          roots.push(root);
        } catch (err) {
          console.error(`[widgets] failed to mount ${key}:`, err);
        }
      }
    };

    // Serialized, coalescing processor: never two passes in flight; a reset
    // arriving mid-pass queues exactly one follow-up.
    let inFlight = false;
    let rerunWanted = false;
    const processAll = async () => {
      if (cancelled) return;
      if (inFlight) {
        rerunWanted = true;
        return;
      }
      inFlight = true;
      try {
        await renderMermaid();
        await mountWidgets();
      } finally {
        inFlight = false;
        if (rerunWanted && !cancelled) {
          rerunWanted = false;
          processAll();
        }
      }
    };

    processAll();

    // Self-heal: if the container's HTML is reset (raw blocks reappear),
    // re-process. Our own mutations also fire this, but by then nothing is
    // pending, so it no-ops and the observer settles.
    const healObserver = new MutationObserver(() => {
      if (hasPendingBlocks(container)) processAll();
    });
    healObserver.observe(container, { childList: true, subtree: true });

    const themeObserver = new MutationObserver(() => remermaidOnThemeFlip());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      healObserver.disconnect();
      themeObserver.disconnect();
      // Deferred, not synchronous: this cleanup can itself run mid-unmount of
      // an ancestor (e.g. navigating away from the post), and React throws
      // "Attempted to synchronously unmount a root while React was already
      // rendering" if a nested createRoot() is torn down inside that same
      // commit. Pushing it to a macrotask lets the ancestor's unmount finish
      // first.
      for (const root of roots) {
        setTimeout(() => root.unmount(), 0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
