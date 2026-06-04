"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Calendar, User, ArrowRight, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  author: string;
  image_url: string;
  is_featured?: boolean;
  date?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredPost, setFeaturedPost] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const stored = localStorage.getItem("unity_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const featured = parsed.find((item: NewsItem) => item.is_featured) || parsed[0];
            setFeaturedPost(featured);
            setNews(parsed.filter((item: NewsItem) => item.id !== featured.id));
            setLoading(false);
            return;
          }
        }

        if (!navigator.onLine) {
          loadFallback();
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const featured = data.find((item: NewsItem) => item.is_featured) || data[0];
          setFeaturedPost(featured);
          setNews(data.filter((item: NewsItem) => item.id !== featured.id));
          localStorage.setItem("unity_news", JSON.stringify(data));
        } else {
          loadFallback();
        }
      } catch (err: unknown) {
        console.warn("Error fetching news, loading fallback:", err instanceof Error ? err.message : 'Network error');
        loadFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadFallback() {
      try {
        const stored = localStorage.getItem("unity_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const featured = parsed.find((item: NewsItem) => item.is_featured) || parsed[0];
            setFeaturedPost(featured);
            setNews(parsed.filter((item: NewsItem) => item.id !== featured.id));
            return;
          }
        }
      } catch (e) {
        console.warn("Error reading localStorage news:", e);
      }

      // Hardcoded fallback data
      const defaultNews = [
        {
          id: "1",
          title: "Unity Academy U17 Clinches Victory in Nairobi Elite Cup",
          excerpt: "A tactical masterclass from the young squad leads to a 2-0 win against Mathare Youth.",
          category: "Match Report",
          published_at: "2026-05-12T00:00:00Z",
          author: "Academy Press",
          image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "2",
          title: "New Technical Lab Partnership with Tatu City Sports",
          excerpt: "Advanced biomechanical sensors and high-speed telemetry now available for all elite tracks.",
          category: "Academy News",
          published_at: "2026-05-10T00:00:00Z",
          author: "Director X",
          image_url: "https://images.unsplash.com/photo-1526232759583-26f1b20d7331?q=80&w=800&auto=format&fit=crop",
        },
        {
          id: "3",
          title: "Scholarship Assessments: June Intake Announced",
          excerpt: "Open trials for the merit-based scholarship program to be held at the Main Arena.",
          category: "Opportunities",
          published_at: "2026-05-08T00:00:00Z",
          author: "Enrollment Team",
          image_url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
        }
      ];
      setFeaturedPost(defaultNews[0]);
      setNews(defaultNews.slice(1));
      try {
        localStorage.setItem("unity_news", JSON.stringify(defaultNews));
      } catch (e) {
        console.warn("Error caching default news in news/page.tsx fallback:", e);
      }
    }

    fetchNews();

    const channel = supabase
      .channel("news-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "news" }, () => {
        fetchNews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Media Center</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-foreground dark:text-white tracking-tighter leading-none transition-colors">
              Academy <br />
              <span className="text-foreground/40 dark:text-white/40">Chronicles.</span>
            </h1>
          </div>
          <div className="flex items-center space-x-6 pb-2">
             <span className="text-xs font-bold text-foreground dark:text-white border-b-2 border-secondary pb-1">All Chronicles</span>
          </div>
        </div>

        {/* Featured Story */}
        {featuredPost && (
          <section className="relative group">
             <LiquidGlassCard className="p-0 overflow-hidden relative aspect-[21/9]">
                {featuredPost.image_url && (
                  <Image 
                    src={featuredPost.image_url} 
                    alt="Featured" 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-background/20 dark:via-black/20 to-transparent transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-12 space-y-6 max-w-4xl">
                   <span className="bg-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{featuredPost.category || "Featured Story"}</span>
                   <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">{featuredPost.title}</h2>
                   <p className="text-lg text-foreground/60 dark:text-white/60 line-clamp-2 transition-colors">{featuredPost.excerpt}</p>
                   <Link href={`/news/${featuredPost.id}`} className="inline-flex items-center space-x-4 group/btn">
                      <span className="text-foreground dark:text-white font-bold uppercase tracking-widest text-xs transition-colors">Read Full Feature</span>
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover/btn:bg-secondary group-hover/btn:text-white transition-all">
                         <ArrowRight className="w-4 h-4" />
                      </div>
                   </Link>
                </div>
             </LiquidGlassCard>
          </section>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {news.map((item) => (
            <Link href={`/news/${item.id}`} key={item.id} className="space-y-6 group cursor-pointer block">
               <div className="aspect-[4/3] relative rounded-3xl overflow-hidden border border-border transition-colors">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute top-4 left-4">
                     <span className="bg-background/80 dark:bg-black/60 backdrop-blur-md text-foreground/60 dark:text-white/60 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-border">
                        {item.category}
                     </span>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest transition-colors">
                     <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-secondary" />
                        <span>{formatDate(item.published_at || item.date)}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-secondary" />
                        <span>{item.author || "Academy Press"}</span>
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground dark:text-white tracking-tight leading-tight group-hover:text-secondary transition-colors">{item.title}</h3>
                  <p className="text-sm text-foreground/40 dark:text-white/40 leading-relaxed line-clamp-3 transition-colors">{item.excerpt}</p>
                  <div className="pt-4 flex items-center justify-between border-t border-border opacity-0 group-hover:opacity-100 transition-all">
                     <span className="text-[10px] text-foreground dark:text-white font-bold uppercase tracking-widest transition-colors">Continue Reading</span>
                     <Share2 className="w-4 h-4 text-foreground/20 dark:text-white/20 hover:text-secondary transition-colors" />
                  </div>
               </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
