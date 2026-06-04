"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { MapPin, Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Match {
  id: string;
  status: string;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  match_time: string;
  venue: string;
  competition: string;
}

interface TeamStanding {
  id: string;
  league_name: string;
  team_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  goal_difference: number;
  points: number;
}

interface PotmData {
  name: string;
  squad: string;
  position: string;
  month: string;
  bio: string;
  image: string;
}

export default function MatchSchedulePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [potm, setPotm] = useState<PotmData | null>(null);
  const [selectedLeague, setSelectedLeague] = useState("");

  const uniqueLeagues = Array.from(new Set(standings.map(s => s.league_name)));

  useEffect(() => {
    if (standings.length > 0) {
      const leagues = Array.from(new Set(standings.map(s => s.league_name)));
      if (leagues.length > 0 && (!selectedLeague || !leagues.includes(selectedLeague))) {
        setTimeout(() => {
          setSelectedLeague(leagues[0]);
        }, 0);
      }
    }
  }, [standings, selectedLeague]);

  // Load Player of the Month from localStorage
  useEffect(() => {
    function loadPotm() {
      try {
        const stored = localStorage.getItem("unity_player_of_the_month");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setPotm(parsed);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading POTM:", e);
      }
      // Default fallback
      setPotm({
        name: "David Maina",
        squad: "Elite U18",
        position: "Forward / Striker",
        month: "May 2026",
        bio: "Outstanding performance this month.",
        image: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=600&auto=format&fit=crop"
      });
    }

    loadPotm();
    const interval = setInterval(loadPotm, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Helper: apply local-first localStorage filters (deleted + edited)
    function applyLocalFilters(data: Match[]): Match[] {
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
      const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
      let filtered = data.filter((m: Match) => !deletedIds.includes(m.id));
      filtered = filtered.map((m: Match) => editedMatches[m.id] ? { ...m, ...editedMatches[m.id] } : m);
      return filtered;
    }

    async function fetchData() {
      try {
        // Try localStorage first for instant local-first telemetry
        const storedMatches = localStorage.getItem("unity_matches");
        if (storedMatches) {
          const parsed = JSON.parse(storedMatches);
          if (parsed && parsed.length > 0) {
            setMatches(applyLocalFilters(parsed));
          } else {
            await fetchMatchesFromDb();
          }
        } else {
          await fetchMatchesFromDb();
        }
      } catch (err) {
        console.warn("Matches fetch failed, using fallback:", err);
        loadMatchesFallback();
      }

      try {
        // Try localStorage first for standings
        const storedStandings = localStorage.getItem("unity_league_standings");
        if (storedStandings) {
          const parsed = JSON.parse(storedStandings);
          if (parsed && parsed.length > 0) {
            setStandings(parsed);
          } else {
            await fetchStandingsFromDb();
          }
        } else {
          await fetchStandingsFromDb();
        }
      } catch (err: unknown) {
        console.warn("Standings fetch failed, using fallback:", err instanceof Error ? err.message : 'Network error');
        loadStandingsFallback();
      } finally {
        setLoading(false);
      }
    }

    async function fetchMatchesFromDb() {
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('match_time', { ascending: false });

      if (matchesError) throw matchesError;

      if (matchesData && matchesData.length > 0) {
        const filtered = applyLocalFilters(matchesData);
        setMatches(filtered);
        localStorage.setItem("unity_matches", JSON.stringify(matchesData));
      } else {
        loadMatchesFallback();
      }
    }

    async function fetchStandingsFromDb() {
      const { data: standingsData, error: standingsError } = await supabase
        .from('league_table')
        .select('*')
        .order('points', { ascending: false })
        .order('goal_difference', { ascending: false });

      if (standingsError) throw standingsError;

      if (standingsData && standingsData.length > 0) {
        setStandings(standingsData);
        localStorage.setItem("unity_league_standings", JSON.stringify(standingsData));
      } else {
        loadStandingsFallback();
      }
    }

    function loadMatchesFallback() {
      try {
        const stored = localStorage.getItem("unity_matches");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setMatches(applyLocalFilters(parsed));
            return;
          }
        }
      } catch (e) {
        console.warn("Error reading localStorage matches:", e);
      }
      
      const defaultMatches = [
        {
          id: "m-1",
          status: "RESULT",
          team_a: "Unity Sports Academy",
          team_b: "Gor Mahia Youth",
          score_a: 2,
          score_b: 1,
          match_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Tatu City Stadium",
          competition: "Academy Showcase"
        },
        {
          id: "m-2",
          status: "UPCOMING",
          team_a: "Unity Sports Academy",
          team_b: "Ligi Ndogo SC",
          score_a: 0,
          score_b: 0,
          match_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Tatu City Stadium",
          competition: "Regional Youth League"
        },
        {
          id: "m-3",
          status: "UPCOMING",
          team_a: "Unity U17",
          team_b: "Mathare United Youth",
          score_a: 0,
          score_b: 0,
          match_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Main Pitch",
          competition: "Nairobi Elite Cup"
        }
      ];
      const filtered = applyLocalFilters(defaultMatches);
      setMatches(filtered);
      try {
        localStorage.setItem("unity_matches", JSON.stringify(defaultMatches));
      } catch (e) {
        console.warn("Error caching default matches:", e);
      }
    }

    function loadStandingsFallback() {
      try {
        const stored = localStorage.getItem("unity_league_standings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setStandings(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn("Error reading localStorage standings:", e);
      }

      const defaultStandings = [
        { id: "s-1", league_name: "Nairobi Regional League", team_name: "Unity Academy", matches_played: 12, wins: 10, losses: 0, draws: 2, goal_difference: 24, points: 32 },
        { id: "s-2", league_name: "Nairobi Regional League", team_name: "Ligi Ndogo SC", matches_played: 12, wins: 9, losses: 2, draws: 1, goal_difference: 18, points: 28 },
        { id: "s-3", league_name: "Nairobi Regional League", team_name: "Mathare United Youth", matches_played: 11, wins: 7, losses: 1, draws: 3, goal_difference: 12, points: 24 },
        { id: "s-4", league_name: "Nairobi Regional League", team_name: "Kariobangi Sharks Youth", matches_played: 12, wins: 6, losses: 3, draws: 3, goal_difference: 8, points: 21 },
        { id: "s-5", league_name: "Nairobi Regional League", team_name: "Gor Mahia Youth", matches_played: 12, wins: 5, losses: 3, draws: 4, goal_difference: 4, points: 19 }
      ];
      setStandings(defaultStandings);
      try {
        localStorage.setItem("unity_league_standings", JSON.stringify(defaultStandings));
      } catch (e) {
        console.warn("Error caching default standings:", e);
      }
    }

    fetchData();

    // Poll localStorage every 2 seconds for instant admin changes
    const interval = setInterval(fetchData, 2000);

    // Listen to real-time changes
    const matchChannel = supabase
      .channel('schema-db-changes-matches-schedule')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => fetchData())
      .subscribe();

    const standingsChannel = supabase
      .channel('schema-db-changes-standings-schedule')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'league_table' }, () => fetchData())
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(standingsChannel);
    };
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const activeLeagueName = selectedLeague || (standings.length > 0 ? standings[0].league_name : "Nairobi Regional League");
  const sortedStandings = standings
    .filter(s => s.league_name === activeLeagueName)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.goal_difference - a.goal_difference;
    });

  const upcomingMatches = matches.filter(m => m.status !== 'RESULT');
  const pastResults = matches.filter(m => m.status === 'RESULT');

  // Determine if POTM image is a base64 string or a URL
  const potmImageIsBase64 = potm?.image?.startsWith("data:");

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Competition Center</span>
            <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">
              Match <br />
              <span className="text-foreground/40 dark:text-white/40">Schedule.</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="px-6 py-3 glass rounded-full text-foreground dark:text-white font-bold text-[10px] uppercase tracking-widest flex items-center space-x-2">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <span>Season 2026 Live</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
               {/* Upcoming Section */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-foreground dark:text-white font-bold tracking-tight uppercase text-xs transition-colors">Upcoming Fixtures</h3>
                     <span className="text-foreground/20 dark:text-white/20 text-[10px] font-bold uppercase tracking-widest transition-colors">{activeLeagueName}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {loading && (
                      <div className="p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                        <span>Loading fixtures...</span>
                      </div>
                    )}
                    {!loading && upcomingMatches.length === 0 && (
                      <div className="p-8 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 text-sm">
                        No upcoming fixtures listed.
                      </div>
                    )}
                    {!loading && upcomingMatches.map((match) => (
                      <LiquidGlassCard key={match.id} className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Date/Time Sidebar */}
                          <div className="bg-foreground/5 dark:bg-white/5 lg:w-40 p-6 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-border transition-colors">
                            <span className="text-secondary font-black text-xl">{formatDate(match.match_time)}</span>
                            <span className="text-foreground/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors">{formatTime(match.match_time)}</span>
                          </div>

                          {/* Match Details */}
                          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                            <div className="flex items-center space-x-4 justify-center md:justify-start">
                              <div className="w-10 h-10 bg-foreground/5 dark:bg-white/5 rounded-full border border-border flex items-center justify-center transition-colors">
                                  <span className="text-[10px] font-black text-foreground/40 dark:text-white/40">USA</span>
                              </div>
                              <span className="text-sm font-bold text-foreground dark:text-white transition-colors">{match.team_a}</span>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-1">
                              <span className="text-secondary font-black text-lg italic uppercase tracking-tighter">VS</span>
                              <span className="text-[8px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">{match.status}</span>
                            </div>

                            <div className="flex items-center space-x-4 justify-center md:justify-end">
                              <span className="text-sm font-bold text-foreground dark:text-white text-right order-2 md:order-1 transition-colors">{match.team_b}</span>
                              <div className="w-10 h-10 bg-foreground/5 dark:bg-white/5 rounded-full border border-border flex items-center justify-center order-1 md:order-2 transition-colors">
                                  <span className="text-[10px] font-black text-foreground/40 dark:text-white/40">OPP</span>
                              </div>
                            </div>
                          </div>

                          {/* Venue/Action */}
                          <div className="p-6 flex items-center justify-center md:justify-between border-t lg:border-t-0 lg:border-l border-border gap-4 transition-colors">
                            <div className="flex items-center space-x-2 text-foreground/40 dark:text-white/40 text-[9px] font-bold uppercase tracking-widest transition-colors">
                              <MapPin className="w-3 h-3 text-secondary" />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                        </div>
                      </LiquidGlassCard>
                    ))}
                  </div>
               </div>

               {/* Results Section */}
               <div className="space-y-6 pt-6">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-foreground dark:text-white font-bold tracking-tight uppercase text-xs transition-colors">Latest Results</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {!loading && pastResults.length === 0 && (
                      <div className="p-8 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 text-sm">
                        No match results recorded yet.
                      </div>
                    )}
                    {!loading && pastResults.map((match) => (
                      <LiquidGlassCard key={match.id} className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Date/Time Sidebar */}
                          <div className="bg-foreground/5 dark:bg-white/5 lg:w-40 p-6 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-border transition-colors">
                            <span className="text-foreground/40 dark:text-white/40 font-black text-sm">{formatDate(match.match_time)}</span>
                            <span className="text-secondary text-[10px] font-black uppercase tracking-widest mt-1">FINAL</span>
                          </div>

                          {/* Match Details */}
                          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                            <div className="flex items-center space-x-4 justify-center md:justify-start">
                              <div className="w-10 h-10 bg-foreground/5 dark:bg-white/5 rounded-full border border-border flex items-center justify-center transition-colors">
                                  <span className="text-[10px] font-black text-foreground/40 dark:text-white/40">USA</span>
                              </div>
                              <span className="text-sm font-bold text-foreground dark:text-white transition-colors">{match.team_a}</span>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-1">
                              <span className="text-2xl font-black text-foreground dark:text-white font-heading transition-colors">
                                {match.score_a} - {match.score_b}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 justify-center md:justify-end">
                              <span className="text-sm font-bold text-foreground dark:text-white text-right order-2 md:order-1 transition-colors">{match.team_b}</span>
                              <div className="w-10 h-10 bg-foreground/5 dark:bg-white/5 rounded-full border border-border flex items-center justify-center order-1 md:order-2 transition-colors">
                                  <span className="text-[10px] font-black text-foreground/40 dark:text-white/40">OPP</span>
                              </div>
                            </div>
                          </div>

                          {/* Venue/Action */}
                          <div className="p-6 flex items-center justify-center md:justify-between border-t lg:border-t-0 lg:border-l border-border gap-4 transition-colors">
                            <div className="flex items-center space-x-2 text-foreground/40 dark:text-white/40 text-[9px] font-bold uppercase tracking-widest transition-colors">
                              <MapPin className="w-3 h-3 text-secondary" />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                        </div>
                      </LiquidGlassCard>
                    ))}
                  </div>
               </div>
            </div>

            {/* Sidebar - Standings */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-foreground dark:text-white font-bold tracking-tight uppercase text-xs transition-colors">League Table</h3>
                  <Trophy className="w-4 h-4 text-secondary" />
               </div>

               <LiquidGlassCard className="p-8 space-y-6">
                  {uniqueLeagues.length > 1 && (
                    <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
                      {uniqueLeagues.map((league) => (
                        <button
                          key={league}
                          onClick={() => setSelectedLeague(league)}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                            activeLeagueName === league
                              ? "bg-secondary text-white shadow-md shadow-secondary/15"
                              : "glass text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white"
                          }`}
                        >
                          {league}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                     <div className="grid grid-cols-6 text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-widest border-b border-border pb-2 transition-colors">
                        <span className="col-span-3">Club</span>
                        <span className="text-center">P</span>
                        <span className="text-center">GD</span>
                        <span className="text-center text-secondary">PTS</span>
                     </div>
                     
                     {loading && (
                       <div className="py-8 text-center text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px]">
                         Loading table...
                       </div>
                     )}
                     {!loading && sortedStandings.length === 0 && (
                       <div className="py-8 text-center text-foreground/40 dark:text-white/40 text-[10px]">
                         No standings recorded.
                       </div>
                     )}
                     {!loading && sortedStandings.map((team, index) => (
                       <div key={team.id || team.team_name} className={`grid grid-cols-6 text-xs font-bold items-center py-1 transition-colors ${team.team_name.includes("Unity") ? 'text-foreground dark:text-white' : 'text-foreground/40 dark:text-white/40'}`}>
                          <div className="col-span-3 flex items-center space-x-3 truncate">
                             <span className="w-4 text-[10px] opacity-20">{index + 1}</span>
                             <span className="truncate">{team.team_name}</span>
                          </div>
                          <span className="text-center">{team.matches_played}</span>
                          <span className="text-center">{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</span>
                          <span className={`text-center ${team.team_name.includes("Unity") ? 'text-secondary font-black' : ''}`}>{team.points}</span>
                       </div>
                     ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border transition-colors">
                     <div className="text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-widest text-center">
                       {activeLeagueName}
                     </div>
                  </div>
               </LiquidGlassCard>

               {/* Player Of The Month Snippet - Dynamic from localStorage */}
               {potm && (
                 <div className="relative rounded-3xl overflow-hidden aspect-[4/5] group border border-border transition-colors">
                    {potmImageIsBase64 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={potm.image} alt={potm.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <Image src={potm.image} alt={potm.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-transparent to-transparent transition-all duration-500" />
                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                       <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Player Of The Month</span>
                       <h4 className="text-2xl font-heading font-black text-foreground dark:text-white transition-colors">{potm.name}</h4>
                       <div className="flex items-center space-x-4 pt-2">
                          <div className="flex flex-col">
                             <span className="text-foreground dark:text-white font-black text-sm transition-colors">{potm.squad}</span>
                             <span className="text-[8px] text-foreground/40 dark:text-white/40 uppercase font-bold tracking-widest transition-colors">{potm.month}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
