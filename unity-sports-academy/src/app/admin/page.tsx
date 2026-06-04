"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  Users, 
  Activity, 
  Trophy, 
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [playerCount, setPlayerCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<{type: string; title: string; time: string; detail: string}[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch players: check local storage first
        let finalPlayerCount = 0;
        const storedPlayers = localStorage.getItem("unity_players");
        if (storedPlayers) {
          finalPlayerCount = JSON.parse(storedPlayers).length;
        } else {
          try {
            const { data: pData, error: pError } = await supabase
              .from('players')
              .select('player_id');
            if (pError) throw pError;
            const deletedPlayerIds = JSON.parse(localStorage.getItem("unity_deleted_players") || "[]");
            if (pData) {
              const activePlayers = pData.filter(p => !deletedPlayerIds.includes(p.player_id));
              finalPlayerCount = activePlayers.length;
              localStorage.setItem("unity_players", JSON.stringify(pData));
            }
          } catch (e) {
            console.warn("Failed to fetch players from DB, using fallback", e);
            const defaultPlayers = [{player_id: "p1"}, {player_id: "p2"}, {player_id: "p3"}, {player_id: "p4"}, {player_id: "p5"}];
            finalPlayerCount = defaultPlayers.length;
            localStorage.setItem("unity_players", JSON.stringify(defaultPlayers));
          }
        }
        setPlayerCount(finalPlayerCount);

        // Fetch matches: check local storage first
        let finalMatchCount = 0;
        const storedMatches = localStorage.getItem("unity_matches");
        if (storedMatches) {
          finalMatchCount = JSON.parse(storedMatches).length;
        } else {
          try {
            const { data: mData, error: mError } = await supabase
              .from('matches')
              .select('id');
            if (mError) throw mError;
            const deletedMatchIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
            if (mData) {
              const activeMatches = mData.filter(m => !deletedMatchIds.includes(m.id));
              finalMatchCount = activeMatches.length;
              localStorage.setItem("unity_matches", JSON.stringify(mData));
            }
          } catch (e) {
            console.warn("Failed to fetch matches from DB, using fallback", e);
            const defaultMatches = [{id: "m-1"}, {id: "m-2"}, {id: "m-3"}];
            finalMatchCount = defaultMatches.length;
            localStorage.setItem("unity_matches", JSON.stringify(defaultMatches));
          }
        }
        setMatchCount(finalMatchCount);

        // Fetch recent news as "logs"
        const storedLogs = localStorage.getItem("unity_recent_logs");
        if (storedLogs) {
          setRecentLogs(JSON.parse(storedLogs));
        } else {
          try {
            const { data: newsLogs, error: nError } = await supabase
              .from('news')
              .select('title, category, published_at')
              .order('published_at', { ascending: false })
              .limit(3);
            
            if (nError) throw nError;

            if (newsLogs) {
              const formattedLogs = newsLogs.map(n => ({
                type: n.category.toUpperCase(),
                title: n.title,
                time: new Date(n.published_at).toLocaleDateString(),
                detail: "System record updated."
              }));
              setRecentLogs(formattedLogs);
              localStorage.setItem("unity_recent_logs", JSON.stringify(formattedLogs));
            }
          } catch (e) {
            console.warn("Failed to fetch news logs from DB, using fallback", e);
            const defaultLogs = [
              { type: "ACADEMY", title: "New Youth Intake Announced", time: new Date().toLocaleDateString(), detail: "System record updated." },
              { type: "MATCHES", title: "Gor Mahia Match Results Logged", time: new Date().toLocaleDateString(), detail: "System record updated." },
              { type: "FACILITIES", title: "Pitch Renovation Complete", time: new Date().toLocaleDateString(), detail: "System record updated." }
            ];
            setRecentLogs(defaultLogs);
            localStorage.setItem("unity_recent_logs", JSON.stringify(defaultLogs));
          }
        }

      } catch (err: unknown) {
        console.warn('General error fetching dashboard data:', err instanceof Error ? err.message : 'Network error');
      }
    }

    fetchDashboardData();

    // Poll for instant cross-tab updates (e.g. deleted players)
    const interval = setInterval(fetchDashboardData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 transition-colors duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors">Command <span className="text-foreground/20 dark:text-white/20">Center.</span></h1>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">Academy operations and real-time telemetry overview.</p>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 transition-colors">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
          <span className="uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Players", value: playerCount.toString(), trend: "Live", icon: Users },
          { label: "Total Matches", value: matchCount.toString(), trend: "Live", icon: Activity },
          { label: "Active Competitions", value: "3", trend: "Stable", icon: Trophy },
        ].map((metric) => (
          <LiquidGlassCard key={metric.label} className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 dark:bg-white/5 flex items-center justify-center transition-colors">
                <metric.icon className="w-5 h-5 text-foreground/40 dark:text-white/40" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest transition-colors">{metric.trend}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-foreground dark:text-white transition-colors">{metric.value}</h3>
              <p className="text-[10px] text-foreground/40 dark:text-white/40 uppercase font-bold tracking-widest transition-colors">{metric.label}</p>
            </div>
          </LiquidGlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Performance Feed */}
        <LiquidGlassCard className="lg:col-span-2 p-10 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground dark:text-white tracking-tight transition-colors">Recent Activity Feed</h3>
              <button className="text-[10px] text-secondary font-bold uppercase tracking-widest hover:underline transition-all">View All Logs</button>
           </div>

           <div className="space-y-6">
              {recentLogs.length > 0 ? recentLogs.map((log, i) => (
                <div key={i} className="flex items-start space-x-6 p-4 rounded-2xl hover:bg-foreground/5 dark:hover:bg-white/5 transition-all cursor-default group">
                   <div className="w-px h-12 bg-foreground/10 dark:bg-white/10 group-hover:bg-secondary transition-colors" />
                   <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">{log.type}</span>
                         <span className="text-[10px] text-foreground/40 dark:text-white/40 font-bold transition-colors">{log.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground dark:text-white transition-colors">{log.title}</h4>
                      <p className="text-xs text-foreground/40 dark:text-white/40 transition-colors">{log.detail}</p>
                   </div>
                </div>
              )) : (
                <div className="text-sm text-foreground/40 dark:text-white/40 italic">No recent activity found.</div>
              )}
           </div>
        </LiquidGlassCard>

        {/* Action Center */}
        <div className="space-y-8">
           <LiquidGlassCard className="p-8 space-y-6 bg-secondary/[0.03] border-secondary/20 transition-colors">
              <h3 className="text-foreground dark:text-white font-bold tracking-tight text-sm transition-colors">Priority Tasks</h3>
              <div className="space-y-4">
                 {[
                   "Review U17 Match Analytics",
                   "Approve Scholarship Applications",
                   "Update Training Schedule"
                 ].map((task, i) => (
                   <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-foreground/5 dark:bg-white/5 border border-border text-xs text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white transition-all cursor-pointer">
                      <div className="w-2 h-2 rounded-full border border-secondary" />
                      <span>{task}</span>
                   </div>
                 ))}
              </div>
           </LiquidGlassCard>

           <div className="relative rounded-3xl overflow-hidden glass border border-border p-8 space-y-4 transition-colors">
              <div className="flex items-center space-x-3">
                 <Clock className="w-4 h-4 text-secondary" />
                 <span className="text-[10px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest transition-colors">Next Session</span>
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-bold text-foreground dark:text-white tracking-tight transition-colors">Elite U18 Tactical</h4>
                 <p className="text-xs text-foreground/40 dark:text-white/40 transition-colors">Pitch A • 16:30 PM Today</p>
              </div>
              <button className="w-full py-3 bg-foreground dark:bg-white text-background dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-secondary dark:hover:bg-secondary transition-all">
                 Launch Session Monitor
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
