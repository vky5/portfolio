"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

/*
 * Renders <pre><code class="language-mermaid"> blocks (as produced by the
 * editor) into SVG diagrams. The mermaid bundle is imported only when a
 * page actually contains a diagram. The original source is kept on the
 * figure so diagrams re-render when the theme flips.
 *
 * Two authoring realities are handled here:
 *   - A leading `%%{init: {...}}%%` directive would pin a theme and fight
 *     our light/dark control, so we strip it.
 *   - Labels authored with raw line breaks inside quotes ("a\n(b)") are
 *     invalid mermaid; on a failed parse we retry with those newlines
 *     converted to <br/> before giving up.
 */

let seq = 0;

/** Drop a leading %%{init ...}%% directive so our theme choice wins. */
function stripInitDirective(src: string): string {
  return src.replace(/^\s*%%\{[\s\S]*?\}%%[ \t]*\r?\n?/, "");
}

/** Convert newlines that sit *inside* double-quoted labels into <br/>. */
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

export function useMermaid(
  ref: RefObject<HTMLElement | null>,
  deps: DependencyList,
) {
  useEffect(() => {
    let cancelled = false;
    const container = ref.current;
    if (!container) return;

    const renderAll = async () => {
      const pending = container.querySelectorAll<HTMLElement>(
        "code.language-mermaid",
      );
      const rerender = container.querySelectorAll<HTMLElement>(
        "figure[data-mermaid-src]",
      );
      console.log(
        `[mermaid] hook running — ${pending.length} pending, ${rerender.length} to re-render`,
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

      // Render `source`, retrying once with newline-in-quote healing.
      const toSvg = async (source: string): Promise<string> => {
        const clean = stripInitDirective(source);
        try {
          const { svg } = await mermaid.render(`mermaid-${seq++}`, clean);
          return svg;
        } catch {
          const { svg } = await mermaid.render(
            `mermaid-${seq++}`,
            healQuotedNewlines(clean),
          );
          return svg;
        }
      };

      const draw = async (target: HTMLElement, src: string) => {
        // Keep the raw source so theme flips can re-render from scratch.
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

    renderAll();

    // Theme flips re-render diagrams in the matching palette.
    const observer = new MutationObserver(() => renderAll());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
