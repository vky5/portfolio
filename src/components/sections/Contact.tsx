"use client";

import { useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EMAIL } from "@/lib/site";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — the mailto link still works.
    }
  };

  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      <a
        href={`mailto:${EMAIL}`}
        className="text-primary transition-colors hover:text-foreground"
      >
        {EMAIL}
      </a>
      <button
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="relative flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-3.5 w-3.5 text-primary" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground"
          >
            copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactSection() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-14 py-16 md:py-20">
      <SectionHeader
        kicker="contact"
        title="Get in touch"
        sub="The fastest route is email. The form works too — it lands in the same inbox."
      />

      <Reveal>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <CopyEmail />
            <div className="flex gap-6 font-mono text-sm">
              <a
                href="https://github.com/vky5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                github ↗
              </a>
              <a
                href="https://www.linkedin.com/in/vky5/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                linkedin ↗
              </a>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Your name"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Your email"
              />
            </div>
            <Textarea
              rows={4}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              aria-label="Your message"
              className="resize-none"
            />
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full sm:w-auto"
            >
              {status === "loading"
                ? "Sending…"
                : status === "success"
                  ? "Sent — thanks!"
                  : "Send message"}
            </Button>
            {status === "error" && (
              <p className="text-sm text-destructive">
                Couldn&apos;t send right now. Email me directly instead.
              </p>
            )}
          </form>
        </div>
      </Reveal>
    </section>
  );
}
