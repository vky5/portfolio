"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, goToSection } from "@/lib/site";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  perform: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [dynamicItems, setDynamicItems] = useState<Item[]>([]);
  const fetchedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme, resolvedTheme } = useTheme();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const staticItems: Item[] = [
    { id: "s-experience", group: "Go to", label: "Experience", perform: () => goToSection("experience") },
    { id: "s-projects", group: "Go to", label: "Projects", perform: () => goToSection("projects") },
    { id: "s-writing", group: "Go to", label: "Writing", perform: () => goToSection("writing") },
    { id: "s-contact", group: "Go to", label: "Contact", perform: () => goToSection("contact") },
    { id: "p-all", group: "Go to", label: "All projects", hint: "/projects", perform: () => (window.location.href = "/projects") },
    { id: "w-all", group: "Go to", label: "All writing", hint: "/writing", perform: () => (window.location.href = "/writing") },
    {
      id: "a-theme",
      group: "Actions",
      label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
      keywords: "theme toggle dark light",
      perform: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    {
      id: "a-email",
      group: "Actions",
      label: "Copy email address",
      hint: EMAIL,
      keywords: "contact mail",
      perform: () => navigator.clipboard.writeText(EMAIL).catch(() => {}),
    },
    {
      id: "a-terminal",
      group: "Actions",
      label: "Open terminal",
      hint: "the phosphor kind",
      keywords: "shell cli console",
      perform: () => window.dispatchEvent(new CustomEvent("open-terminal")),
    },
    { id: "a-github", group: "Actions", label: "GitHub", hint: "↗", keywords: "code repos", perform: () => window.open(GITHUB_URL, "_blank") },
    { id: "a-linkedin", group: "Actions", label: "LinkedIn", hint: "↗", perform: () => window.open(LINKEDIN_URL, "_blank") },
  ];

  // Projects and posts stream in the first time the palette opens.
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const [projects, blogs] = await Promise.all([
          fetch("/api/projects").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/blogs").then((r) => (r.ok ? r.json() : [])),
        ]);
        const items: Item[] = [
          ...projects.map(
            (p: { _id: string; title: string; year: string; githubLink?: string; liveLink?: string }) => ({
              id: `proj-${p._id}`,
              group: "Projects",
              label: p.title,
              hint: p.year,
              keywords: "project",
              perform: () => {
                if (p.liveLink) window.open(p.liveLink, "_blank");
                else if (p.githubLink) window.open(p.githubLink, "_blank");
                else goToSection("projects");
              },
            }),
          ),
          ...blogs.map(
            (b: { id: string; title: string; type: string; externalLink?: string; readTime?: string }) => ({
              id: `post-${b.id}`,
              group: "Writing",
              label: b.title,
              hint: b.readTime,
              keywords: "post blog article",
              perform: () => {
                if (b.type === "external" && b.externalLink)
                  window.open(b.externalLink, "_blank");
                else window.location.href = `/blog/${b.id}`;
              },
            }),
          ),
        ];
        setDynamicItems(items);
      } catch {
        // Palette still works with static entries.
      }
    })();
  }, [open]);

  const all = [...staticItems, ...dynamicItems];
  const q = query.trim().toLowerCase();
  const results = q
    ? all.filter((i) =>
        `${i.label} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(q),
      )
    : all;

  // Global ⌘K / Ctrl+K and open-palette event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  const run = (item: Item) => {
    close();
    item.perform();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      run(results[selected]);
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mx-auto mt-[14vh] w-[min(560px,92vw)] overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="font-mono text-sm text-primary">❯</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                esc
              </kbd>
            </div>

            <ul className="max-h-[46vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-sm text-muted-foreground">
                  nothing found for “{query}”
                </li>
              )}
              {results.map((item, i) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <li key={item.id}>
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {item.group}
                      </p>
                    )}
                    <button
                      onClick={() => run(item)}
                      onMouseMove={() => setSelected(i)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        i === selected
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hint && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.hint}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
