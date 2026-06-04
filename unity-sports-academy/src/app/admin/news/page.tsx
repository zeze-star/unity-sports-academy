"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import {
  Newspaper,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Star,
  Loader2,
  Calendar,
  Eye,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast, useConfirm } from "@/components/providers/ToastProvider";

const CATEGORIES = [
  "Academy News",
  "Match Report",
  "Player Spotlight",
  "Community",
  "Announcement",
  "Coaching Insight",
];

interface NewsPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  is_featured: boolean;
  published_at: string;
}

const EMPTY_POST: Omit<NewsPost, "id" | "published_at"> = {
  title: "",
  category: "Academy News",
  excerpt: "",
  content: "",
  image_url: "",
  is_featured: false,
};

export default function NewsBlogManager() {
  const toast = useToast();
  const confirm = useConfirm();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [form, setForm] = useState<Omit<NewsPost, "id" | "published_at">>(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  /* ─── Fetch helpers ─────────────────────────────────────────── */
  const loadFallback = useCallback(() => {
    try {
      const stored = localStorage.getItem("unity_news");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Error reading localStorage news:", e);
    }

    // Default seed data
    const defaults: NewsPost[] = [
      {
        id: "n-1",
        title: "Unity Academy Unveils New Training Facility",
        category: "Academy News",
        excerpt: "State-of-the-art facilities now open for all squads ahead of the 2026 season.",
        content: "Unity Sports Academy is proud to announce the opening of its new state-of-the-art training facility...",
        image_url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop",
        is_featured: true,
        published_at: new Date().toISOString(),
      },
      {
        id: "n-2",
        title: "U17 Squad Wins Regional Cup",
        category: "Match Report",
        excerpt: "The U17 Academy squad clinched the Nairobi Regional Cup with a stunning 3-1 victory.",
        content: "In a thrilling final played at Tatu City Stadium, Unity U17 defeated rivals Mathare United Youth 3-1...",
        image_url: "https://images.unsplash.com/photo-1551958219-acbc03ab2645?q=80&w=1200&auto=format&fit=crop",
        is_featured: false,
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setPosts(defaults);
    localStorage.setItem("unity_news", JSON.stringify(defaults));
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setPosts(data);
        localStorage.setItem("unity_news", JSON.stringify(data));
      } else {
        loadFallback();
      }
    } catch (err: unknown) {
      console.warn("Error fetching news:", err instanceof Error ? err.message : 'Network error');
      loadFallback();
    } finally {
      setLoading(false);
    }
  }, [loadFallback]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  /* ─── Open Modal ─────────────────────────────────────────── */
  function openNew() {
    setEditingPost(null);
    setForm(EMPTY_POST);
    setPreview(null);
    setShowModal(true);
  }

  function openEdit(post: NewsPost) {
    setEditingPost(post);
    setForm({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url,
      is_featured: post.is_featured,
    });
    setPreview(post.image_url || null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingPost(null);
    setForm(EMPTY_POST);
    setPreview(null);
  }

  /* ─── Handle image URL preview ───────────────────────────── */
  function handleImageUrl(url: string) {
    setForm((prev) => ({ ...prev, image_url: url }));
    setPreview(url || null);
  }

  /* ─── Image file → Base64 ────────────────────────────────── */
  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = (ev) => {
      img.src = ev.target?.result as string;
      img.onload = () => {
        const maxW = 800;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const b64 = canvas.toDataURL("image/jpeg", 0.8);
        setForm((prev) => ({ ...prev, image_url: b64 }));
        setPreview(b64);
      };
    };
    reader.readAsDataURL(file);
  }

  /* ─── Save (create or update) ────────────────────────────── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.category) return;
    setSaving(true);

    const payload = {
      ...form,
      published_at: editingPost?.published_at || new Date().toISOString(),
    };

    try {
      if (editingPost) {
        /* ── UPDATE ── */
        const { error } = await supabase
          .from("news")
          .update(payload)
          .eq("id", editingPost.id);

        const stored = localStorage.getItem("unity_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map((p: NewsPost) =>
            p.id === editingPost.id ? { ...p, ...payload } : p
          );
          localStorage.setItem("unity_news", JSON.stringify(updated));
          if (error) {
            console.error("DB update failed, saved locally:", error.message);
            setPosts(updated);
          }
        }
        if (!error) {
          setPosts((prev) =>
            prev.map((p) => (p.id === editingPost.id ? { ...p, ...payload } : p))
          );
        }
      } else {
        /* ── INSERT ── */
        const { data, error } = await supabase
          .from("news")
          .insert([payload])
          .select();

        const stored = localStorage.getItem("unity_news");
        const currentList = stored ? JSON.parse(stored) : [];
        const newLocal: NewsPost = {
          id: data?.[0]?.id || `local-${Date.now()}`,
          ...payload,
        };
        const updatedList = [newLocal, ...currentList];
        localStorage.setItem("unity_news", JSON.stringify(updatedList));

        if (error) {
          console.error("DB insert failed, saved locally:", error.message);
          setPosts(updatedList);
        } else if (data) {
          setPosts((prev) => [data[0], ...prev]);
        }
      }

      closeModal();
      toast.success(editingPost ? `"${form.title}" updated successfully!` : `"${form.title}" published!`);
    } catch (err) {
      console.error("Error saving post:", err);
      toast.error("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  /* ─── Toggle Featured ────────────────────────────────────── */
  async function toggleFeatured(post: NewsPost) {
    const newVal = !post.is_featured;
    try {
      const { error } = await supabase
        .from("news")
        .update({ is_featured: newVal })
        .eq("id", post.id);

      const stored = localStorage.getItem("unity_news");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((p: NewsPost) =>
          p.id === post.id ? { ...p, is_featured: newVal } : p
        );
        localStorage.setItem("unity_news", JSON.stringify(updated));
        if (error) {
          console.error("DB featured toggle failed, saved locally:", error.message);
          setPosts(updated);
        }
      }
      if (!error) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, is_featured: newVal } : p))
        );
      }
    } catch (err) {
      console.error("Error toggling featured:", err);
    }
  }

  /* ─── Delete ─────────────────────────────────────────────── */
  async function handleDelete(post: NewsPost) {
    const ok = await confirm({
      title: "Delete Post",
      message: `Are you sure you want to permanently delete "${post.title}"? This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;
    try {
      const { error } = await supabase.from("news").delete().eq("id", post.id);

      const stored = localStorage.getItem("unity_news");
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((p: NewsPost) => p.id !== post.id);
        localStorage.setItem("unity_news", JSON.stringify(filtered));
        if (error) {
          console.error("DB delete failed, removed locally:", error.message);
          setPosts(filtered);
        }
      }
      if (!error) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      }
      toast.success(`"${post.title}" has been deleted.`);
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post. Please try again.");
    }
  }

  /* ─── Filtered list ──────────────────────────────────────── */
  const filtered =
    activeFilter === "All"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-10 transition-colors duration-500 relative">
      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">
                {editingPost ? "Edit Post" : "New Post"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-foreground/10 dark:hover:bg-white/10 text-foreground/40 dark:text-white/40 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Unity Academy Wins Regional Cup"
                  required
                />
              </div>

              {/* Category + Featured Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-background">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">
                    Featured Story
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                    className={`w-full p-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                      form.is_featured
                        ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20"
                        : "bg-foreground/5 dark:bg-white/5 border-border text-foreground/60 dark:text-white/60"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${form.is_featured ? "fill-white" : ""}`} />
                    <span>{form.is_featured ? "Featured ✓" : "Set as Featured"}</span>
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">
                  Excerpt (short summary)
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors resize-none"
                  placeholder="Short teaser shown on the news feed..."
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">
                  Full Content Body
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors resize-none font-mono text-sm"
                  placeholder="Write the full article here. Use # for headings, > for quotes..."
                />
              </div>

              {/* Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">
                  Cover Image
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={form.image_url.startsWith("data:") ? "" : form.image_url}
                      onChange={(e) => handleImageUrl(e.target.value)}
                      className="w-full p-3 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-xs text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest">
                      — or Upload File
                    </label>
                    <label className="flex items-center justify-center w-full p-3 bg-foreground/5 dark:bg-white/5 border border-dashed border-border rounded-xl cursor-pointer hover:border-secondary transition-colors">
                      <span className="flex items-center space-x-2 text-xs text-foreground/40 dark:text-white/40">
                        <ImageIcon className="w-4 h-4" />
                        <span>Choose image...</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFile}
                      />
                    </label>
                  </div>
                </div>
                {preview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setForm((prev) => ({ ...prev, image_url: "" }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-lg text-foreground/60 hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 bg-foreground/10 dark:bg-white/10 text-foreground dark:text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-foreground/20 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20 flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingPost ? "Update Post" : "Publish Post"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors">
            News &amp; Blog.
          </h1>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">
            Publish, edit, and manage all academy news stories and blog posts.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center space-x-3 bg-secondary text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center space-x-2 bg-foreground/5 dark:bg-white/5 border border-border p-1 rounded-xl w-fit flex-wrap gap-1">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              activeFilter === cat
                ? "bg-secondary text-white shadow-md shadow-secondary/15"
                : "text-foreground/50 dark:text-white/50 hover:text-foreground dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Posts Grid ── */}
      {loading ? (
        <div className="p-16 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 text-secondary animate-spin" />
            <span>Loading posts...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 text-sm">
          No posts found. Click &quot;New Post&quot; to publish your first story.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <LiquidGlassCard
              key={post.id}
              className="p-0 overflow-hidden group hover:border-secondary/30 transition-all"
            >
              {/* Cover image */}
              <div className="relative h-44 bg-foreground/5 dark:bg-white/5 overflow-hidden">
                {post.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-foreground/20 dark:text-white/20" />
                  </div>
                )}
                {/* Featured badge */}
                {post.is_featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-secondary text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>Featured</span>
                  </div>
                )}
                {/* Category badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-background/80 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest rounded-full text-foreground dark:text-white">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground dark:text-white leading-snug transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-foreground/60 dark:text-white/60 leading-relaxed line-clamp-2 transition-colors">
                    {post.excerpt}
                  </p>
                )}

                {/* Action row */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEdit(post)}
                      className="p-2 bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-white/60 rounded-lg hover:text-secondary hover:bg-secondary/10 transition-all"
                      title="Edit post"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="p-2 bg-foreground/5 dark:bg-white/5 text-foreground/40 dark:text-white/40 rounded-lg hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFeatured(post)}
                      className={`p-2 rounded-lg transition-all ${
                        post.is_featured
                          ? "bg-secondary/15 text-secondary"
                          : "bg-foreground/5 dark:bg-white/5 text-foreground/40 dark:text-white/40 hover:text-secondary"
                      }`}
                      title={post.is_featured ? "Unmark as featured" : "Set as featured"}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${post.is_featured ? "fill-secondary" : ""}`}
                      />
                    </button>
                    <a
                      href={`/news/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-foreground/5 dark:bg-white/5 text-foreground/40 dark:text-white/40 rounded-lg hover:text-secondary hover:bg-secondary/10 transition-all"
                      title="Preview live post"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      )}

      {/* ── Summary Stats ── */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: posts.length },
            { label: "Featured", value: posts.filter((p) => p.is_featured).length },
            { label: "Categories", value: [...new Set(posts.map((p) => p.category))].length },
            {
              label: "Published This Month",
              value: posts.filter((p) => {
                const d = new Date(p.published_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length,
            },
          ].map((stat) => (
            <LiquidGlassCard key={stat.label} className="p-6 space-y-2">
              <p className="text-3xl font-black text-foreground dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-foreground/40 dark:text-white/40 font-black uppercase tracking-widest">
                {stat.label}
              </p>
            </LiquidGlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
