"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, Plus, X } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExperienceItem {
  id?: string;
  type: "work" | "achievement";
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
  skills: string[];
}

export default function ExperienceManager() {
  const router = useRouter();
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState<"work" | "achievement">("work");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");

  // Tag State
  const [tagInput, setTagInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Highlights State
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) router.push("/admin");
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    const res = await fetch("/api/experience");
    if (res.ok) {
      setItems(await res.json());
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setType("work");
    setRole("");
    setCompany("");
    setPeriod("");
    setDescription("");
    setSkills([]);
    setHighlights([]);
  };

  const handleEdit = (p: ExperienceItem) => {
    setEditingId(p.id || null);
    setType(p.type || "work");
    setRole(p.role);
    setCompany(p.company);
    setPeriod(p.period);
    setDescription(p.description);
    setSkills(p.skills || []);
    setHighlights(p.highlights || []);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !skills.includes(tagInput.trim())) {
      setSkills([...skills, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setSkills(skills.filter((t) => t !== tag));
  };

  // Highlights Logic
  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!role) return alert("Role/Title required");

    const payload = {
      id: editingId,
      type,
      role,
      company,
      period,
      description,
      highlights,
      skills,
    };

    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Saved!");
      resetForm();
      fetchItems();
    } else {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/experience?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Experience & Achievements</h1>
          </div>
          {/* <ModeToggle /> */}
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* List */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Items</h2>
              <Button size="sm" onClick={resetForm} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> New
              </Button>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">
              {items.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded border cursor-pointer transition-colors ${editingId === p.id ? "bg-primary/10 border-primary/20" : "bg-card hover:bg-white/5"}`}
                  onClick={() => handleEdit(p)}
                >
                  <div className="flex justify-between">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${p.type === "achievement" ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}
                    >
                      {p.type}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id!);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mt-1">{p.role}</h3>
                  <p className="text-xs text-muted-foreground">
                    {p.company} • {p.period}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Item" : "Create New Item"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={type}
                onValueChange={(v) => setType(v as "work" | "achievement")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work Experience</SelectItem>
                  <SelectItem value="achievement">Achievement/Award</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder={
                    type === "work" ? "Role / Job Title" : "Achievement Title"
                  }
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Input
                  placeholder={
                    type === "work" ? "Company Name" : "Organization / Event"
                  }
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Input
                  placeholder={
                    type === "work"
                      ? "Period (Example: Jan 2024 - Present)"
                      : "Date (e.g. Dec 2023)"
                  }
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground ml-1">
                  Format: Month Year - Month Year (or Present)
                </p>
              </div>

              <Textarea
                placeholder="Short Summary / Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Highlights */}
              <div className="space-y-2 border p-3 rounded-md bg-muted/20">
                <h3 className="text-sm font-medium">
                  Detailed Highlights (Bullet Points)
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a specific achievement/task..."
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddHighlight()}
                  />
                  <Button
                    onClick={handleAddHighlight}
                    size="sm"
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <ul className="space-y-1 mt-2">
                  {highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-start text-sm bg-background p-2 rounded border"
                    >
                      <span>• {h}</span>
                      <button
                        onClick={() => removeHighlight(i)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add Skill / Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => removeTag(t)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,165,0,0.3)] transition-all font-semibold"
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
