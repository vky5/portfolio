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
 * This generalises the old useMermaid hook: mermaid is now just one branch.
 * Both channels ride Tiptap code blocks, the only markup proven to survive the
 * editor → Mongo → dangerouslySetInnerHTML round-trip.
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

export function useBlogWidgets(
  ref: RefObject<HTMLElement | null>,
  deps: DependencyList,
) {
  useEffect(() => {
    let cancelled = false;
    const container = ref.current;
    if (!container) return;
    // Roots created for React widgets — must be unmounted on cleanup so a
    // chapter/content change does not leak detached trees.
    const roots: { unmount: () => void }[] = [];

    const renderMermaid = async () => {
      const pending = container.querySelectorAll<HTMLElement>(
        "code.language-mermaid",
      );
      const rerender = container.querySelectorAll<HTMLElement>(
        "figure[data-mermaid-src]",
      );
      if (pending.length === 0 && rerender.length === 0) return;

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
      for (const fig of rerender) {
        await draw(fig, fig.dataset.mermaidSrc ?? "");
      }
    };

    const mountWidgets = async () => {
      const { createRoot } = await import("react-dom/client");
      if (cancelled) return;

      for (const key of Object.keys(widgetRegistry)) {
        const blocks = container.querySelectorAll<HTMLElement>(
          `code.language-${key}`,
        );
        for (const code of blocks) {
          const target = code.closest("pre") ?? code;
          const raw = (code.textContent ?? "").trim();
          let props: Record<string, unknown> = {};
          if (raw.startsWith("{")) {
            try {
              props = JSON.parse(raw);
            } catch {
              // Ignore malformed props; render the widget with defaults.
            }
          }

          const mount = document.createElement("div");
          mount.dataset.widget = key;
          target.replaceWith(mount);

          const mod = await widgetRegistry[key]();
          if (cancelled) return;
          const root = createRoot(mount);
          root.render(createElement(mod.default, props));
          roots.push(root);
        }
      }
    };

    renderMermaid();
    mountWidgets();

    // Mermaid re-renders in the matching palette on theme flips. Widgets are
    // already CSS-var themed, so they need no re-mount.
    const observer = new MutationObserver(() => renderMermaid());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      for (const root of roots) root.unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
