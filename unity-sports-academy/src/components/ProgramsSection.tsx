"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "./ui/liquid-glass-card";
import { Target, Zap, Shield, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Program {
  title: string;
  category: string;
  desc: string;
  icon: React.ElementType;
  image: string;
  color: string;
}

interface Session {
  id: string;
  title: string;
  squad: string;
  venue: string;
  time: string;
  date: string;
  gender: string;
  type: string;
  status: string;
}

export function ProgramsSection() {
  // Programs are fetched but only used to populate sessions;
  // the state vars below drive the visible training schedule UI.
  const [, setPrograms] = useState<Program[]>([]);
  const [, setLoading] = useState(true);

  // Daily Training Schedule States
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeGender, setActiveGender] = useState<string>("All");
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const stored = localStorage.getItem("unity_programs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setPrograms(parsed);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;

        if (data && data.length > 0) {
          const icons = [Target, Zap, Shield, Heart];
          const colors = ["rgba(200, 169, 107, 0.2)", "rgba(15, 81, 50, 0.2)", "rgba(230, 57, 70, 0.2)", "rgba(255, 255, 255, 0.1)"];
          
          const formattedPrograms = data.map((p, index) => ({
            title: p.title,
            category: p.age_range || "Training Program",
            desc: p.description || "",
            icon: icons[index % icons.length],
            color: colors[index % colors.length],
            image: p.image_url || "https://images.unsplash.com/photo-1518091043644-c1d445bcc97a?q=80&w=800&auto=format&fit=crop"
          }));
          setPrograms(formattedPrograms);
          localStorage.setItem("unity_programs", JSON.stringify(formattedPrograms));
        } else {
          loadProgramsFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching programs:', err instanceof Error ? err.message : 'Network error');
        loadProgramsFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadProgramsFallback() {
      try {
        const stored = localStorage.getItem("unity_programs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setPrograms(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn("Error reading localStorage programs:", e);
      }
      
      const defaultPrograms = [
        { title: "Junior Development", category: "U8 - U12", desc: "Foundation skills", icon: Target, color: "rgba(200, 169, 107, 0.2)", image: "https://images.unsplash.com/photo-1518091043644-c1d445bcc97a?q=80&w=800&auto=format&fit=crop" }
      ];
      setPrograms(defaultPrograms);
      try {
        localStorage.setItem("unity_programs", JSON.stringify(defaultPrograms));
      } catch (e) {
        console.warn("Error caching default programs:", e);
      }
    }

    fetchPrograms();

    const channel = supabase
      .channel('schema-db-changes-programs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'programs'
        },
        () => {
          fetchPrograms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch Daily Training Sessions
  useEffect(() => {
    // Helper: apply local-first localStorage filters (deleted + edited)
    function applyLocalFilters(data: Session[]): Session[] {
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_sessions") || "[]");
      const editedSessions = JSON.parse(localStorage.getItem("unity_edited_sessions") || "{}");
      let filtered = data.filter((s: Session) => !deletedIds.includes(s.id));
      filtered = filtered.map((s: Session) => editedSessions[s.id] ? { ...s, ...editedSessions[s.id] } : s);
      return filtered;
    }

    async function fetchSessions() {
      try {
        // Try localStorage first for instant local-first telemetry
        const stored = localStorage.getItem("unity_sessions");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setSessions(applyLocalFilters(parsed));
            setSessionsLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const filtered = applyLocalFilters(data);
          setSessions(filtered);
          localStorage.setItem("unity_sessions", JSON.stringify(data));
        } else {
          loadSessionsFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching sessions:', err instanceof Error ? err.message : 'Network error');
        loadSessionsFallback();
      } finally {
        setSessionsLoading(false);
      }
    }

    function loadSessionsFallback() {
      try {
        const stored = localStorage.getItem("unity_sessions");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setSessions(applyLocalFilters(parsed));
            return;
          }
        }
      } catch (e) {
        console.warn("Error loading localStorage sessions:", e);
      }
      
      // Default sessions fallback
      const defaultSessions = [
        { id: "1", title: "Tactical Setup & Drills", squad: "Elite U18", venue: "Main Pitch A", time: "08:00 AM - 10:00 AM", date: "Every Monday & Wednesday", gender: "Men", type: "Training", status: "Active" },
        { id: "2", title: "High-Speed Telemetry Session", squad: "Senior Ladies", venue: "Main Arena", time: "10:30 AM - 12:30 PM", date: "Every Tuesday & Thursday", gender: "Women", type: "Training", status: "Active" },
        { id: "3", title: "Goalkeeper Command Clinic", squad: "All Squads", venue: "Goal Lab", time: "02:00 PM - 04:00 PM", date: "Every Friday", gender: "Men", type: "Specialized", status: "Upcoming" },
        { id: "4", title: "Youth Skills Foundation", squad: "U13 Academy", venue: "Youth Pitch B", time: "04:30 PM - 06:00 PM", date: "Every Saturday", gender: "Women", type: "Foundation", status: "Active" },
      ];
      setSessions(applyLocalFilters(defaultSessions));
      try {
        localStorage.setItem("unity_sessions", JSON.stringify(defaultSessions));
      } catch (e) {
        console.warn("Error caching default sessions in ProgramsSection fallback:", e);
      }
    }

    fetchSessions();

    // Poll localStorage every 2 seconds for instant admin changes
    const interval = setInterval(fetchSessions, 2000);

    const channel = supabase
      .channel('schema-db-changes-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions'
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredSessions = sessions.filter(s => {
    if (activeGender === "All") return true;
    return s.gender?.toLowerCase() === activeGender.toLowerCase();
  });

  return (
    <section className="bg-background section-padding relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Daily Training Schedule Section */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-px w-12 bg-secondary" />
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Real-time scheduling</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-heading font-black text-foreground leading-tight tracking-tighter">
                Daily Training <br />
                <span className="text-foreground/40 dark:text-white/40">Schedule.</span>
              </h3>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center space-x-3 bg-foreground/5 dark:bg-white/5 border border-border p-1.5 rounded-2xl">
              {["All", "Men", "Women"].map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGender(g)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    activeGender === g
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                      : "text-foreground/50 dark:text-white/50 hover:text-foreground dark:hover:text-white"
                  }`}
                >
                  {g === "All" ? "All Sessions" : g === "Men" ? "Men's" : "Women's"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionsLoading && (
              <div className="col-span-full py-16 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                Loading schedules...
              </div>
            )}
            {!sessionsLoading && filteredSessions.length === 0 && (
              <div className="col-span-full py-16 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                No active sessions found for this category.
              </div>
            )}
            {!sessionsLoading && filteredSessions.map((session, idx) => (
              <LiquidGlassCard
                key={session.id || idx}
                className="p-8 space-y-6 flex flex-col justify-between border-border hover:border-secondary/30 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-secondary/10 border border-secondary/20 text-secondary text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {session.type || "Training"}
                    </span>
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      session.gender?.toLowerCase() === "women"
                        ? "bg-unity-gold/10 border border-unity-gold/20 text-unity-gold"
                        : "bg-foreground/10 dark:bg-white/10 border border-border text-foreground/70 dark:text-white/70"
                    }`}>
                      {session.gender}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-foreground dark:text-white group-hover:text-secondary transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-xs text-foreground/40 dark:text-white/40 uppercase tracking-wider font-bold">
                      {session.squad}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/40 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground/40 dark:text-white/40 uppercase font-bold tracking-wider text-[10px]">Time:</span>
                    <span className="font-semibold text-foreground dark:text-white/80">{session.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground/40 dark:text-white/40 uppercase font-bold tracking-wider text-[10px]">Date / Day:</span>
                    <span className="font-semibold text-foreground dark:text-white/80">{session.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-foreground/40 dark:text-white/40 uppercase font-bold tracking-wider text-[10px]">Pitch/Venue:</span>
                    <span className="font-semibold text-foreground dark:text-white/80">{session.venue}</span>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
