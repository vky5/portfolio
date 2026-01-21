"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, LogOut, ShieldCheck, Home, Mail } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { InboxViewer } from "@/components/Admin/InboxViewer";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check session storage on mount for token
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_token", data.token);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 mt-12 md:mt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card p-6 rounded-lg border border-border shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Welcome back, vky5admin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full md:w-auto"
              >
                <Home className="mr-2 h-4 w-4" /> Home
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full md:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Real-time overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-background rounded border border-border">
                    <span className="text-muted-foreground">
                      Session Status
                    </span>
                    <span className="text-green-600 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded border border-border">
                    <span className="text-muted-foreground">Auth Type</span>
                    <span className="text-foreground font-medium">
                      Server Session
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Quick actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Create new blog posts or book summaries using the advanced
                    editor.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => router.push("/admin/editor")}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Open Content Editor
                    </Button>
                    <Button
                      onClick={() => router.push("/admin/projects")}
                      variant="outline"
                      className="w-full"
                    >
                      Manage Projects
                    </Button>
                    <Button
                      onClick={() => router.push("/admin/experience")}
                      variant="outline"
                      className="w-full"
                    >
                      Manage Experience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Inbox
                </CardTitle>
                <CardDescription>
                  Recent messages from the contact form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InboxViewer />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg">
        <CardHeader className="space-y-1 text-center pb-8 border-b border-gray-100 dark:border-zinc-800/50">
          <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Admin Access
          </CardTitle>
          <CardDescription>
            Enter your secure credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-all duration-300"
            >
              Authenticate & Generate Token
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
