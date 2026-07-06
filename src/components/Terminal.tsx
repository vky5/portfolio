"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, goToSection } from "@/lib/site";

/*
 * A working shell, not a costume. Amber-on-black regardless of theme —
 * it's a CRT. Opened from ⌘K, or by clicking the footer colophon.
 */

type Line = { kind: "in" | "out"; text: string };

const BANNER = "vky5 shell — type 'help' to look around";

const HELP = `help           this list
whoami         who runs this place
ls             what's on this site
ls projects    projects, from the database
ls writing     posts, from the database
open <place>   projects · writing · contact · github · linkedin
email          copy my email address
theme <mode>   dark · light
stack          how this site works
clear          wipe the phosphor
exit           close the terminal`;

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: BANNER }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-terminal", onOpen);
    return () => window.removeEventListener("open-terminal", onOpen);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  const print = (text: string) =>
    setLines((l) => [...l, { kind: "out", text }]);

  const listFromApi = async (
    url: string,
    fmt: (x: Record<string, string>) => string,
  ) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.length === 0) return print("(empty)");
      print(data.map(fmt).join("\n"));
    } catch {
      print("error: could not reach the database");
    }
  };

  const run = async (raw: string) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { kind: "in", text: cmd }]);
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        print(HELP);
        break;
      case "whoami":
        print(
          "vaibhav yadav — systems engineer.\nkubernetes, ci/cd pipelines, distributed backends,\nand the full-stack apps on top of them.",
        );
        break;
      case "ls":
        if (arg === "projects") {
          await listFromApi("/api/projects", (p) => `${p.year}  ${p.title}`);
        } else if (arg === "writing" || arg === "blog" || arg === "blogs") {
          await listFromApi("/api/blogs", (b) => `${b.date}  ${b.title}`);
        } else {
          print("experience/  projects/  writing/  contact/");
        }
        break;
      case "open":
      case "cd":
      case "goto":
        if (["projects", "writing", "experience", "contact"].includes(arg)) {
          setOpen(false);
          goToSection(arg);
        } else if (arg === "github") window.open(GITHUB_URL, "_blank");
        else if (arg === "linkedin") window.open(LINKEDIN_URL, "_blank");
        else print(`open: unknown place '${arg}' — try 'ls'`);
        break;
      case "email":
      case "contact":
        try {
          await navigator.clipboard.writeText(EMAIL);
          print(`${EMAIL} — copied to clipboard`);
        } catch {
          print(EMAIL);
        }
        break;
      case "theme":
        if (arg === "dark" || arg === "light") {
          setTheme(arg);
          print(`theme set to ${arg}. the terminal stays amber — it's a CRT.`);
        } else print("usage: theme dark | theme light");
        break;
      case "stack":
        print(
          "next 16 (rsc + isr) · tailwind v4 · framer-motion\nmongodb atlas · cloudinary · geist\naccent: P3 phosphor amber, oklch(0.78 0.16 75)",
        );
        break;
      case "sudo":
        if (arg.includes("hire")) {
          print("permission granted. opening mail client…");
          window.location.href = `mailto:${EMAIL}?subject=Let's talk`;
        } else {
          print("vky5 is not in the sudoers file. this incident will be reported.");
        }
        break;
      case "rm":
        print("rm: permission denied. the phosphor is load-bearing.");
        break;
      case "admin":
      case "login":
        print("opening the operator's door…");
        window.location.href = "/admin";
        break;
      case "vim":
      case "vi":
      case "nano":
      case "emacs":
        print("you're in a terminal inside a portfolio. let's not go deeper.");
        break;
      case ":q!":
      case ":q":
      case ":wq":
      case "exit":
      case "quit":
        setOpen(false);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        print(`command not found: ${head} — try 'help'`);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const value = input;
      setInput("");
      run(value);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(next >= 0 ? history[next] : "");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 flex h-[min(420px,70vh)] w-[min(600px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[#b07a1a]/40 bg-[#0c0903]/95 font-mono text-[13px] leading-relaxed text-[#ffb000] shadow-2xl backdrop-blur-sm"
          role="dialog"
          aria-label="Terminal"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Scanlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, #ffb000 2px, #ffb000 3px)",
            }}
          />

          <div className="flex items-center justify-between border-b border-[#b07a1a]/30 px-3 py-2 text-[11px] text-[#b07a1a]">
            <span>vky5@portfolio:~</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close terminal"
              className="px-1 transition-colors hover:text-[#ffb000]"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
            {lines.map((line, i) => (
              <pre key={i} className="whitespace-pre-wrap break-words">
                {line.kind === "in" ? (
                  <>
                    <span className="text-[#b07a1a]">❯ </span>
                    {line.text}
                  </>
                ) : (
                  line.text
                )}
              </pre>
            ))}
            <div className="flex">
              <span className="text-[#b07a1a]">❯&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                aria-label="Terminal input"
                className="w-full bg-transparent text-[#ffb000] caret-[#ffb000] outline-none"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
