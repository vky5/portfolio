"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

/*
 * Renders <pre><code class="language-mermaid"> blocks (as produced by the
 * editor) into SVG diagrams. The mermaid bundle is imported only when a
 * page actually contains a diagram. The source is kept on the figure so
 * diagrams re-render when the theme flips.
 */

let seq = 0;

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
      if (pending.length === 0 && rerender.length === 0) return;

      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      const dark = document.documentElement.classList.contains("dark");
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "neutral",
        fontFamily: "var(--font-geist-mono), monospace",
      });

      const draw = async (target: HTMLElement, src: string) => {
        const id = `mermaid-${seq++}`;
        try {
          const { svg } = await mermaid.render(id, src);
          if (cancelled) return;
          const fig = document.createElement("figure");
          fig.className = "mermaid-figure";
          fig.dataset.mermaidSrc = src;
          fig.innerHTML = svg;
          target.replaceWith(fig);
        } catch (err) {
          // Leave the code block visible; a broken diagram beats nothing.
          console.error("mermaid render failed:", err);
          document.getElementById(id)?.remove();
        }
      };

      for (const code of pending) {
        const src = code.textContent ?? "";
        await draw(code.closest("pre") ?? code, src);
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
