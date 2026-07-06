import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggle";

export default function ArchiveHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/75 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Vaibhav Yadav
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
}
