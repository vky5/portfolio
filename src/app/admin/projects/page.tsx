"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, Plus, X, Upload } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";

interface Project {
  _id?: string;
  id?: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  githubLink: string;
  liveLink: string;
  blogLink: string;
  icon: string;
  coverImage?: string;
}

export default function ProjectEditor() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [blogLink, setBlogLink] = useState("");
  const [icon, setIcon] = useState("Code");
  const [coverImage, setCoverImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Tag State
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) router.push("/admin");
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      setProjects(await res.json());
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setYear(new Date().getFullYear().toString());
    setDescription("");
    setGithubLink("");
    setLiveLink("");
    setBlogLink("");
    setTags([]);
    setIcon("Code");
    setCoverImage("");
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id || null);
    setTitle(p.title);
    setYear(p.year);
    setDescription(p.description);
    setGithubLink(p.githubLink || "");
    setLiveLink(p.liveLink || "");
    setBlogLink(p.blogLink || "");
    setTags(p.tags || []);
    setIcon(p.icon || "Code");
    setCoverImage(p.coverImage || "");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title) return alert("Title required");

    const payload = {
      id: editingId,
      title,
      year,
      description,
      tags,
      githubLink,
      liveLink,
      blogLink,
      icon,
      coverImage,
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Project saved!");
      resetForm();
      fetchProjects();
    } else {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.secure_url);
        alert("Image uploaded!");
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Project Manager</h1>
          </div>
          {/* <ModeToggle /> */}
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* List */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Existing Projects</h2>
              <Button size="sm" onClick={resetForm} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> New
              </Button>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">
              {projects.map((p) => (
                <div
                  key={p._id || p.id}
                  className={`p-4 rounded border cursor-pointer transition-colors ${(p._id || p.id) === editingId ? "bg-primary/10 border-primary/20" : "bg-card hover:bg-white/5"}`}
                  onClick={() => handleEdit(p)}
                >
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.year}</p>
                  <div className="flex justify-end mt-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id!);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Project" : "Create New Project"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <div className="flex items-center gap-4">
                  {coverImage && (
                    <div className="relative w-20 h-20 rounded border overflow-hidden">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setCoverImage("")}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex-grow">
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {isUploading
                            ? "Uploading..."
                            : "Click to upload cover"}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add Tech Tag (e.g. React)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
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

              {/* Links */}
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="GitHub URL"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                />
                <Input
                  placeholder="Live Demo URL"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                />
                <Input
                  className="md:col-span-2"
                  placeholder="Related Blog Post URL (Optional)"
                  value={blogLink}
                  onChange={(e) => setBlogLink(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,165,0,0.3)] transition-all"
                >
                  Save Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
