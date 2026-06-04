"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface NewsArticle {
  title: string;
  date: string;
  category: string;
  image: string;
}

// Removed MOCK_ARTICLES to strictly use real data.

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Check both cache keys (unity_news_cache = component cache, unity_news = admin cache)
        const stored = localStorage.getItem("unity_news_cache") || localStorage.getItem("unity_news");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
             setArticles(parsed.slice(0, 3).map((n: { title: string; category: string; published_at: string; image_url: string }) => ({
              title: n.title,
              category: n.category,
              date: n.published_at ? new Date(n.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('en-US'),
              image: n.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
            })));
            setLoading(false);
            return;
          }
        }

        // Don't attempt network requests when offline - prevents browser-level fetch errors
        if (!navigator.onLine) {
          loadNewsFallback();
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          localStorage.setItem("unity_news_cache", JSON.stringify(data));
          const formattedNews = data.map(n => ({
            title: n.title,
            category: n.category,
            date: new Date(n.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            image: n.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
          }));
          setArticles(formattedNews);
        } else {
          loadNewsFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching news, using fallback:', err instanceof Error ? err.message : 'Network error');
        loadNewsFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadNewsFallback() {
      try {
        const stored = localStorage.getItem("unity_news_cache");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setArticles(parsed.slice(0, 3).map((n: { title: string; category: string; published_at: string; image_url: string }) => ({
              title: n.title,
              category: n.category,
              date: n.published_at ? new Date(n.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('en-US'),
              image: n.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
            })));
            return;
          }
        }
      } catch (e) {
        console.warn("Error reading local news cache:", e);
      }
      
      const fallbackNews = [
        { title: "Summer Training Camp Registration Open", category: "Academy", date: "Jun 15, 2024", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" }
      ];
      setArticles(fallbackNews);
    }

    fetchNews();

    const channel = supabase
      .channel('schema-db-changes-news')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        () => {
          fetchNews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <section className="bg-background section-padding transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <div className="h-px w-12 bg-secondary" />
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Academy Updates</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-tight tracking-tighter">
              Latest News <br />
              <span className="text-muted-foreground/40">& Announcements.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {articles.length === 0 && !loading && (
            <div className="col-span-1 lg:col-span-3 p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
              No recent news published yet.
            </div>
          )}
          {loading && (
            <div className="col-span-1 lg:col-span-3 p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
              Loading latest news...
            </div>
          )}
          {articles.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group cursor-pointer">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border mb-6">
                  <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {article.category}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <div className="pt-2 flex items-center space-x-2 text-foreground font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    <span className="group-hover:text-secondary transition-colors">Read Article</span>
                    <ArrowRight className="w-3 h-3 text-secondary" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
