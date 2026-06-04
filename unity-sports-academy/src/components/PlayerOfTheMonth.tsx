"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "./ui/liquid-glass-card";
import { Trophy, Star, Target, Sparkles } from "lucide-react";
import Image from "next/image";

interface PlayerOfMonthData {
  name: string;
  squad: string;
  position: string;
  month: string;
  bio: string;
  image: string;
}

export function PlayerOfTheMonth() {
  const [data, setData] = useState<PlayerOfMonthData | null>(null);

  useEffect(() => {
    function loadPlayerOfTheMonth() {
      try {
        const stored = localStorage.getItem("unity_player_of_the_month");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setData(parsed);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading player of the month from localStorage:", e);
      }

      // Default fallback
      setData({
        name: "David Maina",
        squad: "Elite U18",
        position: "Forward / Striker",
        month: "May 2026",
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
        bio: "David has been in sensational form this month, scoring 6 goals in 4 matches, including a stellar hat-trick against Gor Mahia Youth. His tactical intelligence, explosive speed, and clinical finishing have been instrumental to our squad's undefeated run."
      });
    }

    loadPlayerOfTheMonth();

    // Listen to localStorage changes
    const handleStorageChange = () => {
      loadPlayerOfTheMonth();
    };

    window.addEventListener("storage", handleStorageChange);
    // Poll local changes in single-page navigation
    const interval = setInterval(loadPlayerOfTheMonth, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!data) return null;

  return (
    <section className="bg-background section-padding relative overflow-hidden transition-colors duration-500 border-t border-border/30">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-unity-gold/5 blur-[120px] rounded-full -translate-y-1/2 -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3"
          >
            <div className="h-px w-12 bg-unity-gold" />
            <span className="text-unity-gold font-bold tracking-[0.2em] uppercase text-xs">Academy Honors</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-tight tracking-tighter transition-colors">
            Player Of <br />
            <span className="text-foreground/40 dark:text-white/20 transition-colors">The Month.</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <LiquidGlassCard className="p-0 overflow-hidden border border-unity-gold/30 bg-gradient-to-br from-unity-gold/[0.02] to-secondary/[0.02]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Image Section */}
              <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-[500px] overflow-hidden">
                {data.image.startsWith("data:") ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 absolute inset-0"
                  />
                ) : (
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background dark:from-black via-transparent to-transparent opacity-90 lg:opacity-70" />
                
                {/* Gold Honor Badge */}
                <div className="absolute top-6 left-6 px-4 py-2 glass border border-unity-gold/50 rounded-2xl flex items-center space-x-2 shadow-lg backdrop-blur-md">
                  <Trophy className="w-4 h-4 text-unity-gold animate-bounce" />
                  <span className="text-[10px] font-black text-unity-gold uppercase tracking-widest">{data.month}</span>
                </div>
              </div>

              {/* Detail Section */}
              <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center space-y-8 relative">
                {/* Large decorative graphic behind */}
                <div className="absolute right-8 bottom-8 opacity-[0.02] -z-10 pointer-events-none select-none">
                  <Sparkles className="w-80 h-80 text-unity-gold" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-unity-gold">
                    <Star className="w-4 h-4 fill-unity-gold text-unity-gold" />
                    <span>{data.squad}</span>
                    <span className="text-foreground/20">•</span>
                    <span className="text-foreground/60 dark:text-white/60">{data.position}</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground dark:text-white tracking-tight leading-none transition-colors">
                    {data.name}
                  </h3>
                </div>

                <div className="w-16 h-1 bg-unity-gold rounded-full" />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[10px] text-foreground/40 dark:text-white/40 uppercase tracking-widest font-black">
                    <Target className="w-3.5 h-3.5 text-unity-gold" />
                    <span>Outstanding Achievement</span>
                  </div>
                  <p className="text-lg text-foreground/70 dark:text-white/70 leading-relaxed italic transition-colors">
                    &ldquo;{data.bio}&rdquo;
                  </p>
                </div>

                {/* Micro metrics */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border transition-colors">
                  <div>
                    <span className="text-[8px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest block transition-colors">Tactical Rating</span>
                    <span className="text-xl font-black text-foreground dark:text-white transition-colors">9.4/10</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest block transition-colors">Work Ethic</span>
                    <span className="text-xl font-black text-unity-gold transition-colors">Class-A</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest block transition-colors">Telemetry Status</span>
                    <span className="text-xl font-black text-primary transition-colors uppercase animate-pulse">Peak</span>
                  </div>
                </div>

              </div>

            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    </section>
  );
}
