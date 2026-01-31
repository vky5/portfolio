"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";

export default function ContactSlide() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const socialLinks = [
    { Icon: FaGithub, url: "https://github.com/vky5", label: "GitHub" },
    {
      Icon: FaLinkedin,
      url: "https://www.linkedin.com/in/vky5/",
      label: "LinkedIn",
    },
  ];

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
    <div className="flex items-center min-h-[calc(100vh-160px)]">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
            <span className="text-primary">./contact</span>
          </h1>
          <div className="flex justify-center items-center gap-2 text-muted-foreground mb-4">
            <Terminal className="w-4 h-4" />
            <span className="text-sm">root@vky5:~/contact</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Ready to architect scalable solutions? Reach out below!
          </p>
        </motion.div>

        {/* Contact Info + Socials */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex items-center space-x-4 group">
              <Mail className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
              <a
                href="mailto:vaibhavk05@proton.me"
                className="text-foreground hover:text-primary transition-colors text-lg"
              >
                vaibhavk05@proton.me
              </a>
            </div>

            {/* Social Links */}
            <motion.div
              className="flex space-x-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {socialLinks.map(({ Icon, url, label }, idx) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary text-3xl transition-all"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, color: "var(--primary)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSend}
            className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all h-12"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all h-12"
            />
            <Textarea
              rows={4}
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none"
            />
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`w-full h-12 text-primary-foreground font-semibold transition-all duration-300 ${
                status === "success"
                  ? "bg-green-500/80"
                  : "bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(255,165,0,0.3)]"
              }`}
            >
              {status === "loading"
                ? "Sending..."
                : status === "success"
                  ? "Message Sent!"
                  : "Send Message"}
            </Button>
            {status === "error" && (
              <p className="text-red-500 text-sm text-center">
                Failed to send message. Please try again.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}
