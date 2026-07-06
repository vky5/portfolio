import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/hooks/use-toast";
import { MotionProvider } from "@/components/motion/MotionProvider";
import PhosphorGrid from "@/components/PhosphorGrid";
import CommandPalette from "@/components/CommandPalette";
import Terminal from "@/components/Terminal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vaibhav Yadav — Systems Engineer",
    template: "%s — Vaibhav Yadav",
  },
  description:
    "Systems engineer working on distributed systems, Kubernetes, and the infrastructure modern applications run on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <MotionProvider>
            <ToastProvider>
              <PhosphorGrid />
              {children}
              <CommandPalette />
              <Terminal />
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
