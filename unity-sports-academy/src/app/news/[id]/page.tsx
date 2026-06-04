"use client";

import React, { use, useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Calendar, ArrowLeft, Link as LinkIcon, Loader2 } from "lucide-react";
import { FaTwitter, FaFacebook } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  author: string;
  image_url: string;
  content: string;
  date?: string;
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const stored = localStorage.getItem("unity_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find((item: Article) => String(item.id) === String(id));
          if (found) {
            setArticle(found);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          loadFallback();
        } else if (data) {
          setArticle(data);
        } else {
          loadFallback();
        }
      } catch (err: unknown) {
        console.warn("Error fetching article, checking fallback:", err instanceof Error ? err.message : 'Network error');
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
          const found = parsed.find((item: Article) => String(item.id) === String(id));
          if (found) {
            setArticle(found);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading localStorage news details:", e);
      }

      // Hardcoded fallback logic
      const defaultNews = [
        {
          id: "1",
          title: "Unity Academy U17 Clinches Victory in Nairobi Elite Cup",
          excerpt: "A tactical masterclass from the young squad leads to a 2-0 win against Mathare Youth.",
          category: "Match Report",
          published_at: "2026-05-12T00:00:00Z",
          author: "Academy Press",
          image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
          content: "The Nairobi Elite Cup match between Unity Sports Academy U17 and Mathare Youth was more than a local derby. It was a showcase of the technical evolution taking place in Tatu City. From the first whistle, Unity demonstrated a level of positional discipline that kept Mathare on the back foot.\n\nDavid Maina, the standout performer of the match, found the back of the net in the 24th minute following a lightning-fast transition phase. The telemetry data captured during the play showed Maina reaching a top speed of 31.4 km/h during his burst into the final third.\n\nThe second half saw a more defensive posture from Unity, focusing on mid-block stability. The analysis after the game confirmed a 92% formation adherence rate, the highest for the squad this season. The victory cements Unity's position at the top of the regional table."
        },
        {
          id: "2",
          title: "New Technical Lab Partnership with Tatu City Sports",
          excerpt: "Advanced biomechanical sensors and high-speed telemetry now available for all elite tracks.",
          category: "Academy News",
          published_at: "2026-05-10T00:00:00Z",
          author: "Director X",
          image_url: "https://images.unsplash.com/photo-1526232759583-26f1b20d7331?q=80&w=800&auto=format&fit=crop",
          content: "We are thrilled to announce a ground-breaking partnership with Tatu City Sports to deploy state-of-the-art telemetry and biomechanical sensor technologies. Every elite academy player will now have access to performance analytics dashboard tracking sprint metrics, recovery heart rates, and load distribution.\n\nThis partnership represents a massive step forward in ensuring scientific discipline and long-term athletic sustainability at Unity Sports Academy. We look forward to seeing our players benefit immediately."
        },
        {
          id: "3",
          title: "Scholarship Assessments: June Intake Announced",
          excerpt: "Open trials for the merit-based scholarship program to be held at the Main Arena.",
          category: "Opportunities",
          published_at: "2026-05-08T00:00:00Z",
          author: "Enrollment Team",
          image_url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
          content: "Assessments for our merit-based scholarship program for the June intake will run on June 5th and 6th at the Tatu City Main Arena. The coaching staff will evaluate players across positional awareness, technical skills, physical agility, and behavior.\n\nPre-registration is required. Please check the contact page to secure your spot today."
        }
      ];
      const found = defaultNews.find((item) => String(item.id) === String(id));
      if (found) {
        setArticle(found);
      }
    }

    fetchArticle();
  }, [id]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-20 flex items-center justify-center transition-colors duration-500">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-20 text-center transition-colors duration-500">
        <div className="max-w-md mx-auto px-6 space-y-6">
          <h2 className="text-2xl font-bold text-foreground dark:text-white transition-colors">Article Not Found</h2>
          <p className="text-foreground/60 dark:text-white/60 transition-colors">The chronicle you are looking for does not exist or has been deleted.</p>
          <Link href="/news" className="inline-block px-6 py-3 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:opacity-90">
            Back to Chronicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <Link href="/news" className="inline-flex items-center space-x-2 text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-all group">
           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
           <span className="text-[10px] font-black uppercase tracking-widest">Back to Chronicles</span>
        </Link>

        <div className="space-y-6">
           <span className="bg-secondary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{article.category || "Academy News"}</span>
           <h1 className="text-4xl md:text-7xl font-heading font-black text-foreground dark:text-white tracking-tighter leading-tight transition-colors">
             {article.title}
           </h1>
           
           <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-border transition-colors">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-accent" />
                 <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground dark:text-white tracking-tight transition-colors">{article.author || "Academy Press"}</p>
                    <p className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">Official Reporter</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3 text-foreground/40 dark:text-white/40 transition-colors">
                 <Calendar className="w-4 h-4 text-secondary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(article.published_at || article.date)}</span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center space-x-4">
                 {[FaTwitter, FaFacebook, LinkIcon].map((Icon, i) => (
                   <button key={i} className="w-10 h-10 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground/40 hover:text-foreground dark:text-white/40 dark:hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="aspect-video relative rounded-[40px] overflow-hidden border border-border transition-colors">
             <Image 
               src={article.image_url} 
               alt="Article Hero" 
               fill 
               className="object-cover" 
             />
          </div>
        )}

        {/* Article Body */}
        <article className="prose dark:prose-invert max-w-none space-y-8 text-foreground/75 dark:text-white/75 text-lg leading-relaxed transition-colors">
          {article.content ? (
            article.content.split("\n").filter((p: string) => p.trim() !== "").map((paragraph: string, index: number) => {
              if (paragraph.startsWith("#")) {
                return (
                  <h3 key={index} className="text-3xl font-bold text-foreground dark:text-white tracking-tight pt-8 transition-colors">
                    {paragraph.replace(/^#+\s*/, "")}
                  </h3>
                );
              }
              if (paragraph.startsWith(">")) {
                return (
                  <p key={index} className="text-2xl text-foreground dark:text-white font-medium italic border-l-4 border-secondary pl-8 py-2 transition-colors">
                    {paragraph.replace(/^>\s*/, "")}
                  </p>
                );
              }
              return (
                <p key={index} className="transition-colors">
                  {paragraph}
                </p>
              );
            })
          ) : (
            <p>{article.excerpt}</p>
          )}
        </article>

        {/* Call to Action */}
        <LiquidGlassCard className="p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />
           <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-black text-foreground dark:text-white tracking-tighter transition-colors">Join The Legacy.</h3>
              <p className="text-foreground/60 dark:text-white/40 max-w-xl mx-auto transition-colors">Applications for the next intake are now open. Be part of the next generation of elite athletes.</p>
              <div className="pt-6">
                 <Link href="/pricing" className="px-12 py-5 bg-secondary text-white font-black text-xs uppercase tracking-[0.3em] rounded-full hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all inline-block shadow-lg shadow-secondary/20">
                    Apply For Assessment
                  </Link>
              </div>
           </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
