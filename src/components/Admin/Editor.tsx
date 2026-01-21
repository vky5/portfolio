"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ThemeToggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Save,
  ArrowLeft,
  Plus,
  Link as LinkIcon,
} from "lucide-react";

interface Chapter {
  title: string;
  content: string;
}

import { BlogPost } from "@/data/blogs";

export default function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Content State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("native-simple"); // native-simple, native-book, external

  // New Fields
  const [excerpt, setExcerpt] = useState("");
  const [externalLink, setExternalLink] = useState("");

  // Book Mode State
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
      ImageExtension,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-orange dark:prose-invert max-w-none focus:outline-none min-h-[500px]",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    // Security Check
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Load data if editing
  useEffect(() => {
    const loadData = async () => {
      if (!editSlug) return;
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const allBlogs: BlogPost[] = await res.json();
          const blog = allBlogs.find((b) => b.id === editSlug);
          if (blog) {
            setTitle(blog.title);
            setType(blog.type);
            setExcerpt(blog.excerpt || "");
            setExternalLink(blog.externalLink || "");

            if (blog.type === "native-book" && blog.bookData) {
              setChapters(blog.bookData.chapters);
              if (editor) {
                // Wait for editor to be ready?? actually editor might not be ready yet.
                // We set it when activeIndex changes, but we need to trigger it.
              }
            } else if (blog.type === "native-simple" && blog.content) {
              editor?.commands.setContent(blog.content);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load blog for editing", error);
      }
    };
    if (isAuthenticated) {
      loadData();
    }
  }, [editSlug, isAuthenticated, editor]); // Add editor to dep array to ensure we set content once ready

  // Sync editor content to state when changing chapters (Book Mode)
  useEffect(() => {
    if (editor && type === "native-book" && chapters[activeChapterIndex]) {
      // Load new chapter content
      editor.commands.setContent(chapters[activeChapterIndex].content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapterIndex, editor, type]);

  const addChapter = () => {
    setChapters([
      ...chapters,
      { title: `Chapter ${chapters.length + 1}`, content: "" },
    ]);
    setActiveChapterIndex(chapters.length); // Switch to new
  };

  const updateChapterTitle = (idx: number, newTitle: string) => {
    const newChapters = [...chapters];
    newChapters[idx].title = newTitle;
    setChapters(newChapters);
  };

  // Helper to save current editor content into the active chapter object
  const saveCurrentChapterContent = () => {
    if (!editor || type !== "native-book") return;
    const content = editor.getHTML();
    const newChapters = [...chapters];
    if (newChapters[activeChapterIndex]) {
      newChapters[activeChapterIndex].content = content;
      setChapters(newChapters);
    }
  };

  const handlePublish = async () => {
    if (!editor && type !== "external") return; // editor required unless external

    // If book mode, ensure current chapter is saved
    if (type === "native-book") {
      saveCurrentChapterContent();
      if (!chapters.length) {
        alert("Please add at least one chapter.");
        return;
      }
      chapters[activeChapterIndex].content = editor?.getHTML() || "";
    }

    const contentHTML = editor?.getHTML() || "";
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!id) {
      alert("Please enter a title");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      id,
      title,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      readTime: "5 min read", // Placeholder
      category: "Tech", // Placeholder
      type,
    };

    // Use manual excerpt if provided, otherwise generate
    if (excerpt) {
      payload.excerpt = excerpt;
    } else {
      // Fallback generation
      if (type === "native-book") payload.excerpt = `Book Summary: ${title}`;
      else if (type === "native-simple")
        payload.excerpt = editor?.getText().slice(0, 150) + "...";
      else payload.excerpt = "External Link";
    }

    if (type === "native-book") {
      payload.bookData = {
        chapters: chapters,
      };
    } else if (type === "native-simple") {
      payload.content = contentHTML;
    } else if (type === "external") {
      if (!externalLink) {
        alert("Please provide an External Link URL");
        return;
      }
      payload.externalLink = externalLink;
    }

    // Use original ID if editing, else generate new
    const finalId = editSlug || id;

    try {
      const method = editSlug ? "PATCH" : "POST";
      const body = { ...payload, id: finalId };

      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Published successfully!");
        router.push("/admin");
      } else {
        alert("Failed to publish");
      }
    } catch (e) {
      console.error(e);
      alert("Error publishing");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin")}
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-foreground hidden md:inline">
              {type === "native-book"
                ? "Book Editor"
                : type === "external"
                  ? "External Link"
                  : "Blog Editor"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              onClick={handlePublish}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-12 gap-8">
        {/* Sidebar for Book Mode */}
        {type === "native-book" && (
          <aside className="md:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Chapters</h3>
              <Button variant="outline" size="sm" onClick={addChapter}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {chapters.map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    saveCurrentChapterContent();
                    setActiveChapterIndex(idx);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeChapterIndex === idx
                      ? "bg-orange-100 border-orange-200 dark:bg-orange-900/40 dark:border-orange-800"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  <input
                    className="bg-transparent border-none w-full font-medium focus:outline-none text-sm"
                    value={ch.title}
                    onChange={(e) => updateChapterTitle(idx, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
              {chapters.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No chapters yet. Add one!
                </p>
              )}
            </div>
          </aside>
        )}

        {/* Editor Area */}
        <div
          className={
            type === "native-book"
              ? "md:col-span-9"
              : "md:col-span-8 md:col-start-3"
          }
        >
          <div className="space-y-8">
            {/* Metadata Controls */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-4">
                <Input
                  placeholder={
                    type === "native-book" ? "Book Title" : "Post Title"
                  }
                  className="text-2xl md:text-4xl font-bold border-none px-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50 h-auto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* Manual Excerpt Field */}
                <Textarea
                  placeholder="Add a short summary or excerpt..."
                  className="resize-none border-none text-xl text-muted-foreground px-0 focus-visible:ring-0 bg-transparent min-h-[80px] p-0 font-medium placeholder:text-muted-foreground/40"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />

                {/* External Link Field */}
                {type === "external" && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-dashed border-border animate-in fade-in zoom-in-95">
                    <LinkIcon className="text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="https://example.com/external-article"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      className="bg-transparent border-none focus-visible:ring-0"
                      autoFocus
                    />
                  </div>
                )}
              </div>
              <div>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native-simple">📝 Blog Post</SelectItem>
                    <SelectItem value="native-book">📚 Book Summary</SelectItem>
                    <SelectItem value="external">🔗 External Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toolbar - Hide for External Type */}
            {type !== "external" && editor && (
              <div className="flex flex-wrap gap-1 p-2 border border-border rounded-lg bg-card/30 sticky top-20 z-40 backdrop-blur-md">
                <ToggleBtn
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive("bold")}
                  icon={<Bold className="w-4 h-4" />}
                />
                <ToggleBtn
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                  icon={<Italic className="w-4 h-4" />}
                />
                <div className="w-px h-6 bg-border mx-1" />
                <ToggleBtn
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 1 })}
                  icon={<Heading1 className="w-4 h-4" />}
                />
                <ToggleBtn
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 2 })}
                  icon={<Heading2 className="w-4 h-4" />}
                />
                <div className="w-px h-6 bg-border mx-1" />
                <ToggleBtn
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor.isActive("bulletList")}
                  icon={<List className="w-4 h-4" />}
                />
                <ToggleBtn
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor.isActive("orderedList")}
                  icon={<ListOrdered className="w-4 h-4" />}
                />
                <ToggleBtn
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor.isActive("blockquote")}
                  icon={<Quote className="w-4 h-4" />}
                />
                <div className="ml-auto flex gap-1">
                  <ToggleBtn
                    onClick={() => editor.chain().focus().undo().run()}
                    isActive={false}
                    icon={<Undo className="w-4 h-4" />}
                  />
                  <ToggleBtn
                    onClick={() => editor.chain().focus().redo().run()}
                    isActive={false}
                    icon={<Redo className="w-4 h-4" />}
                  />
                </div>
              </div>
            )}

            {/* Editor Canvas - Hide for External Type */}
            {type !== "external" && (
              <div className="min-h-[500px] mb-32">
                <EditorContent editor={editor} />
              </div>
            )}

            {type === "external" && (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <LinkIcon className="w-12 h-12 mb-4 opacity-50" />
                <p>External links don&apos;t require body content.</p>
                <p className="text-sm">
                  Visitors will be redirected directly to the URL.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Component for Toolbar Buttons
const ToggleBtn = ({
  onClick,
  isActive,
  icon,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-colors ${
      isActive
        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    {icon}
  </button>
);
