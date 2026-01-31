"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  _id?: string;
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export function InboxViewer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => (m._id || m.id) !== id));
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  if (loading)
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading messages...
      </div>
    );

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground italic">
        No new messages
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
      {messages.map((msg) => (
        <div
          key={msg._id || msg.id}
          className="p-4 rounded-lg bg-background border border-border space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-foreground">{msg.name}</h4>
              <button
                onClick={() => (window.location.href = `mailto:${msg.email}`)}
                className="text-sm text-primary hover:underline"
              >
                {msg.email}
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(msg.date), "MMM d, yyyy")}
            </span>
          </div>
          <p className="text-sm text-foreground/80 bg-muted/30 p-2 rounded">
            {msg.message}
          </p>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => handleDelete(msg._id || msg.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
