"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "./ui/liquid-glass-card";
import { MapPin, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Match {
  status: string;
  teamA: { name: string; score: number };
  teamB: { name: string; score: number };
  time: string;
  venue: string;
}

interface RawMatch {
  id: string;
  status: string;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  match_time: string;
  venue: string;
}

export function MatchCenter() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Helper: apply local-first localStorage filters (deleted + edited)
    function applyLocalFilters(data: RawMatch[]): RawMatch[] {
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
      const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
      let filtered = data.filter((m: RawMatch) => !deletedIds.includes(m.id));
      filtered = filtered.map((m: RawMatch) => editedMatches[m.id] ? { ...m, ...editedMatches[m.id] } : m);
      return filtered;
    }

    async function fetchMatches() {
      try {
        // Try localStorage first for instant local-first telemetry
        const stored = localStorage.getItem("unity_matches");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const filtered = applyLocalFilters(parsed);
            const sliced = sliceForDisplay(filtered);
            if (sliced.length > 0) {
              setMatches(formatMatchesData(sliced));
              setLoading(false);
              return;
            }
          }
        }

        // Guard: don't attempt network when offline
        if (!navigator.onLine) {
          loadFallback();
          setLoading(false);
          return;
        }

        // Fetch last played match
        const { data: resultsData, error: resultsError } = await supabase
          .from('matches')
          .select('*')
          .eq('status', 'RESULT')
          .order('match_time', { ascending: false })
          .limit(5);

        if (resultsError) throw resultsError;

        // Fetch next upcoming matches
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('matches')
          .select('*')
          .eq('status', 'UPCOMING')
          .order('match_time', { ascending: true })
          .limit(5);

        if (upcomingError) throw upcomingError;

        let combined: RawMatch[] = [];
        if (resultsData) combined = [...combined, ...resultsData];
        if (upcomingData) combined = [...combined, ...upcomingData];

        if (combined.length > 0) {
          localStorage.setItem("unity_matches", JSON.stringify(combined));
          const filtered = applyLocalFilters(combined);
          const sliced = sliceForDisplay(filtered);
          setMatches(formatMatchesData(sliced));
        } else {
          loadFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching matches, checking fallback:', err instanceof Error ? err.message : 'Network error');
        loadFallback();
      } finally {
        setLoading(false);
      }
    }

    function sliceForDisplay(data: RawMatch[]): RawMatch[] {
      const results = data
        .filter((m: RawMatch) => m.status === 'RESULT')
        .sort((a: RawMatch, b: RawMatch) => new Date(b.match_time).getTime() - new Date(a.match_time).getTime());
      
      const upcoming = data
        .filter((m: RawMatch) => m.status === 'UPCOMING' || m.status === 'LIVE')
        .sort((a: RawMatch, b: RawMatch) => new Date(a.match_time).getTime() - new Date(b.match_time).getTime());
      
      return [
        ...(results.length > 0 ? [results[0]] : []),
        ...upcoming.slice(0, 2)
      ];
    }

    function loadFallback() {
      try {
        const stored = localStorage.getItem("unity_matches");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const filtered = applyLocalFilters(parsed);
            const sliced = sliceForDisplay(filtered);
            if (sliced.length > 0) {
              setMatches(formatMatchesData(sliced));
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Error loading localStorage matches:", e);
      }

      // Hardcoded fallback data
      const defaultMatches = [
        {
          id: "mc-fb-1",
          status: "RESULT",
          team_a: "Unity U19",
          team_b: "Gor Mahia Youth",
          score_a: 2,
          score_b: 1,
          match_time: new Date().toISOString(),
          venue: "Tatu City Stadium"
        },
        {
          id: "mc-fb-2",
          status: "UPCOMING",
          team_a: "Unity Elite",
          team_b: "Kariobangi Sharks",
          score_a: 0,
          score_b: 0,
          match_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Main Pitch"
        },
        {
          id: "mc-fb-3",
          status: "UPCOMING",
          team_a: "Unity Ladies",
          team_b: "Mathare Ladies",
          score_a: 0,
          score_b: 0,
          match_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Main Pitch A"
        }
      ];
      const filtered = applyLocalFilters(defaultMatches);
      try {
        localStorage.setItem("unity_matches", JSON.stringify(defaultMatches));
      } catch (e) {
        console.warn("Error caching default matches in MatchCenter fallback:", e);
      }
      const sliced = sliceForDisplay(filtered);
      setMatches(formatMatchesData(sliced));
    }

    function formatMatchesData(data: RawMatch[]) {
      return data.map(m => ({
        status: m.status,
        teamA: { name: m.team_a, score: m.score_a },
        teamB: { name: m.team_b, score: m.score_b },
        time: m.status === 'UPCOMING' 
          ? new Date(m.match_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : m.status === 'LIVE' ? "78'" : "FINAL",
        venue: m.venue || "Tatu City Stadium"
      }));
    }

    fetchMatches();

    // Poll localStorage every 2 seconds for instant admin changes
    const interval = setInterval(fetchMatches, 2000);

    const channel = supabase
      .channel('schema-db-changes-matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
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
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Match Center</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-tight tracking-tighter transition-colors">
              Latest Results <br />
              <span className="text-foreground/40 dark:text-white/20 transition-colors">& Upcoming Fixtures.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {matches.length === 0 && !loading && (
            <div className="col-span-1 lg:col-span-3 p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
              No recent or upcoming matches found.
            </div>
          )}
          {loading && (
            <div className="col-span-1 lg:col-span-3 p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
              Loading Match Center...
            </div>
          )}
          {matches.map((match, index) => (
            <motion.div
              key={`${match.teamA.name}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <LiquidGlassCard className="p-0 overflow-hidden group">
                {/* Status Bar */}
                <div className={cn(
                  "px-6 py-2 flex items-center justify-between transition-colors",
                  match.status === "LIVE" ? "bg-secondary" : "bg-muted dark:bg-white/10"
                )}>
                  <div className="flex items-center space-x-2">
                    {match.status === "LIVE" && <Activity className="w-3 h-3 text-white animate-pulse" />}
                    <span className={cn(
                      "text-[10px] font-black tracking-widest transition-colors",
                      match.status === "LIVE" ? "text-white" : "text-foreground/40 dark:text-white/40"
                    )}>
                      {match.status}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold transition-colors",
                    match.status === "LIVE" ? "text-white/60" : "text-foreground/20 dark:text-white/20"
                  )}>
                    {match.time}
                  </span>
                </div>

                {/* Score Area */}
                <div className="p-8 space-y-8 bg-card/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-foreground/5 dark:bg-white/5 rounded-full border border-border flex items-center justify-center transition-colors px-2 text-center">
                        <span className="text-[10px] font-black text-foreground/40 dark:text-white/40 leading-tight">UNITY SPORTS</span>
                      </div>
                      <span className="text-xs font-bold text-foreground dark:text-white tracking-tight transition-colors">{match.teamA.name}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl font-heading font-black text-foreground dark:text-white transition-colors">{match.teamA.score}</span>
                        <span className="text-foreground/20 dark:text-white/20 font-black text-xl transition-colors">:</span>
                        <span className="text-4xl font-heading font-black text-foreground dark:text-white transition-colors">{match.teamB.score}</span>
                      </div>
                      {match.status === "UPCOMING" && (
                         <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-2">VS</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-foreground/5 dark:bg-white/5 rounded-full border border-border flex items-center justify-center transition-colors">
                        <span className="text-xl font-black text-foreground/10 dark:text-white/10">OPP</span>
                      </div>
                      <span className="text-xs font-bold text-foreground dark:text-white tracking-tight transition-colors">{match.teamB.name}</span>
                    </div>
                  </div>

                  {/* Venue Info */}
                  <div className="flex items-center justify-center space-x-6 text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest border-t border-border pt-6 transition-colors">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-secondary" />
                      <span>{match.venue}</span>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function for class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
