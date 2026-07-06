"use client";

import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    console.log(
      "%c▉ hello, fellow engineer.\n" +
        "%cThe accent here is P3 phosphor amber — the color of amber CRT terminals.\n" +
        "Source & systems talk: https://github.com/vky5",
      "color: #FFB000; font-weight: bold; font-size: 14px;",
      "color: inherit;",
    );
  }, []);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Vaibhav Yadav</p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-terminal"))}
          title="The color of amber CRT terminal phosphor. Click it."
          className="text-left transition-colors hover:text-foreground"
        >
          accent: P3 phosphor amber · oklch(0.78 0.16 75)
        </button>
      </div>
    </footer>
  );
}
