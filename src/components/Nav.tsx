"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/ThemeToggle";

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A slim band around the upper third of the viewport decides the
      // active section; more stable than visibility ratios.
      { rootMargin: "-25% 0px -65% 0px" },
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    const hero = document.getElementById("top");
    if (hero) observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/75 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
      >
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            history.replaceState(null, "", "/");
          }}
          className="text-sm font-medium tracking-tight text-foreground"
        >
          Vaibhav Yadav
        </button>

        <div className="flex items-center gap-1">
          <ul
            className="flex items-center"
            onMouseLeave={() => setHovered(null)}
          >
            {SECTIONS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id} className="relative">
                  {hovered === id && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-md bg-muted"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <button
                    onClick={() => scrollTo(id)}
                    onMouseEnter={() => setHovered(id)}
                    onFocus={() => setHovered(id)}
                    className={`relative px-2.5 py-1.5 text-[13px] transition-colors sm:px-3 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2.5 bottom-0 h-px bg-primary sm:inset-x-3"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-palette"))}
            aria-label="Open command palette"
            className="hidden items-center gap-1 rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            ⌘K
          </button>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
