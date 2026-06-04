"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Loader2, 
  Save, 
  Edit2, 
  X,
  PlusCircle,
  Award
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast, useConfirm } from "@/components/providers/ToastProvider";

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

interface PlayerSummary {
  id: string;
  name: string;
  squad: string;
  position: string;
  image: string;
}

export default function LeagueStandingsControlPanel() {
  const toast = useToast();
  const confirm = useConfirm();
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState<string>("Nairobi Regional League");
  const [uniqueLeagues, setUniqueLeagues] = useState<string[]>(["Nairobi Regional League"]);
  
  // Modal state for adding a team
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    league_name: "Nairobi Regional League",
    team_name: "",
    matches_played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    goal_difference: 0,
    points: 0
  });

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<TeamStanding | null>(null);

  // New league state
  const [newLeagueName, setNewLeagueName] = useState("");
  const [showNewLeagueInput, setShowNewLeagueInput] = useState(false);

  // Player of the Month Configurator States
  const [players, setPlayers] = useState<PlayerSummary[]>([]);
  const [potmPlayerId, setPotmPlayerId] = useState<string>("");
  const [potmMonth, setPotmMonth] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("unity_player_of_the_month");
      if (saved) return JSON.parse(saved).month || "May 2026";
    } catch { /* ignore */ }
    return "May 2026";
  });
  const [potmPosition, setPotmPosition] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("unity_player_of_the_month");
      if (saved) return JSON.parse(saved).position || "Forward / Striker";
    } catch { /* ignore */ }
    return "Forward / Striker";
  });
  const [potmBio, setPotmBio] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("unity_player_of_the_month");
      if (saved) return JSON.parse(saved).bio || "";
    } catch { /* ignore */ }
    return "";
  });
  const [potmCustomImage, setPotmCustomImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("unity_player_of_the_month");
      if (saved) {
        const img = JSON.parse(saved).image;
        if (img && img.startsWith("data:")) return img;
      }
    } catch { /* ignore */ }
    return "";
  });
  const [potmImagePreview, setPotmImagePreview] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("unity_player_of_the_month");
      if (saved) {
        const img = JSON.parse(saved).image;
        if (img && img.startsWith("data:")) return img;
      }
    } catch { /* ignore */ }
    return "";
  });


  const handlePotmImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPotmImagePreview(result);
      // Compress image
      const img = new window.Image();
      img.src = result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxW = 600;
        const scale = maxW / img.width;
        canvas.width = maxW;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        setPotmCustomImage(compressed);
      };
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const stored = localStorage.getItem("unity_players");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_players") || "[]");
            const editedPlayers = JSON.parse(localStorage.getItem("unity_edited_players") || "{}");
            
            let filtered = parsed.filter((p: PlayerSummary) => !deletedIds.includes(p.id));
            filtered = filtered.map((p: PlayerSummary) => editedPlayers[p.id] ? { ...p, ...editedPlayers[p.id] } : p);
            
            setPlayers(filtered);
            
            // Select matching player
            const savedPotm = localStorage.getItem("unity_player_of_the_month");
            if (savedPotm) {
              const parsedPotm = JSON.parse(savedPotm);
              const matchingPlayer = filtered.find((p: PlayerSummary) => p.name === parsedPotm.name);
              if (matchingPlayer) {
                setPotmPlayerId(matchingPlayer.id);
              } else if (filtered.length > 0) {
                setPotmPlayerId(filtered[0].id);
              }
            } else if (filtered.length > 0) {
              setPotmPlayerId(filtered[0].id);
            }
            return;
          }
        }

        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formatted = data.map(p => ({
            id: p.player_id,
            name: p.name,
            squad: p.squad,
            position: p.position,
            image: p.image_url || "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=200&auto=format&fit=crop"
          }));
          
          const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_players") || "[]");
          const editedPlayers = JSON.parse(localStorage.getItem("unity_edited_players") || "{}");
          
          let filtered = formatted.filter((p: PlayerSummary) => !deletedIds.includes(p.id));
          filtered = filtered.map((p: PlayerSummary) => editedPlayers[p.id] ? { ...p, ...editedPlayers[p.id] } : p);
          
          setPlayers(filtered);
          
          // Select matching player
          const savedPotm = localStorage.getItem("unity_player_of_the_month");
          if (savedPotm) {
            const parsed = JSON.parse(savedPotm);
            const matchingPlayer = filtered.find((p: PlayerSummary) => p.name === parsed.name);
            if (matchingPlayer) {
              setPotmPlayerId(matchingPlayer.id);
            } else if (filtered.length > 0) {
              setPotmPlayerId(filtered[0].id);
            }
          } else if (filtered.length > 0) {
            setPotmPlayerId(filtered[0].id);
          }
        } else {
          loadPlayersFallback();
        }
      } catch (e: unknown) {
        console.warn("Error fetching players for potm:", e instanceof Error ? e.message : 'Network error');
        loadPlayersFallback();
      }
    }
    
    function loadPlayersFallback() {
      try {
        const stored = localStorage.getItem("unity_players");
        if (stored) {
          const parsed = JSON.parse(stored);
          setPlayers(parsed);
          
          const savedPotm = localStorage.getItem("unity_player_of_the_month");
          if (savedPotm) {
            const parsedPotm = JSON.parse(savedPotm);
            const matchingPlayer = parsed.find((p: PlayerSummary) => p.name === parsedPotm.name);
            if (matchingPlayer) {
              setPotmPlayerId(matchingPlayer.id);
            } else if (parsed.length > 0) {
              setPotmPlayerId(parsed[0].id);
            }
          } else if (parsed.length > 0) {
            setPotmPlayerId(parsed[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    fetchPlayers();
  }, []);

  const handleSavePlayerOfTheMonth = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlayer = players.find(p => p.id === potmPlayerId);
    if (!selectedPlayer) {
      toast.error("Please select a player.");
      return;
    }
    
    // Use custom uploaded image if available, otherwise fallback to player image
    const finalImage = potmCustomImage || selectedPlayer.image || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
    
    const potmData = {
      name: selectedPlayer.name,
      squad: selectedPlayer.squad,
      position: potmPosition,
      month: potmMonth,
      bio: potmBio,
      image: finalImage
    };
    
    localStorage.setItem("unity_player_of_the_month", JSON.stringify(potmData));
    toast.success(`Player of the Month updated — ${selectedPlayer.name} (${potmMonth})`);
  };

  useEffect(() => {
    async function fetchStandings() {
      try {
        const stored = localStorage.getItem("unity_league_standings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setStandings(parsed);
            const leagues = Array.from(new Set(parsed.map((item: TeamStanding) => item.league_name))) as string[];
            if (leagues.length > 0) {
              setUniqueLeagues(leagues);
              if (!leagues.includes(activeLeague)) {
                setActiveLeague(leagues[0]);
              }
            }
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from('league_table')
          .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          setStandings(data);
          localStorage.setItem("unity_league_standings", JSON.stringify(data));
          
          // extract unique leagues
          const leagues = Array.from(new Set(data.map((item: TeamStanding) => item.league_name))) as string[];
          if (leagues.length > 0) {
            setUniqueLeagues(leagues);
            // Default to first league if current active isn't in there
            if (!leagues.includes(activeLeague)) {
              setActiveLeague(leagues[0]);
            }
          }
        } else {
          loadFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching standings, checking fallback:', err instanceof Error ? err.message : 'Network error');
        loadFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadFallback() {
      try {
        const stored = localStorage.getItem("unity_league_standings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setStandings(parsed);
            const leagues = Array.from(new Set(parsed.map((item: TeamStanding) => item.league_name))) as string[];
            if (leagues.length > 0) {
              setUniqueLeagues(leagues);
            }
            return;
          }
        }
      } catch (e) {
        console.error("Error reading localStorage league standings:", e);
      }

      // Hardcoded fallback data
      const defaultStandings = [
        { id: "s-1", league_name: "Nairobi Regional League", team_name: "Unity Academy", matches_played: 12, wins: 10, losses: 0, draws: 2, goal_difference: 24, points: 32 },
        { id: "s-2", league_name: "Nairobi Regional League", team_name: "Ligi Ndogo SC", matches_played: 12, wins: 9, losses: 2, draws: 1, goal_difference: 18, points: 28 },
        { id: "s-3", league_name: "Nairobi Regional League", team_name: "Mathare United Youth", matches_played: 11, wins: 7, losses: 1, draws: 3, goal_difference: 12, points: 24 },
        { id: "s-4", league_name: "Nairobi Regional League", team_name: "Kariobangi Sharks Youth", matches_played: 12, wins: 6, losses: 3, draws: 3, goal_difference: 8, points: 21 },
        { id: "s-5", league_name: "Nairobi Regional League", team_name: "Gor Mahia Youth", matches_played: 12, wins: 5, losses: 3, draws: 4, goal_difference: 4, points: 19 }
      ];
      setStandings(defaultStandings);
      localStorage.setItem("unity_league_standings", JSON.stringify(defaultStandings));
    }

    fetchStandings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update unique leagues whenever standings state changes
  useEffect(() => {
    if (standings.length > 0) {
      const leagues = Array.from(new Set(standings.map((item) => item.league_name))) as string[];
      if (leagues.length > 0) {
        setTimeout(() => {
          setUniqueLeagues(leagues);
        }, 0);
      }
    }
  }, [standings]);

  // Auto-calculate matches played and points based on wins/draws/losses
  const updateCalculations = (wins: number, draws: number, losses: number) => {
    const matches_played = Number(wins) + Number(draws) + Number(losses);
    const points = Number(wins) * 3 + Number(draws);
    return { matches_played, points };
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.team_name) {
      toast.error("Please enter a team name.");
      return;
    }

    const { matches_played, points } = updateCalculations(newTeam.wins, newTeam.draws, newTeam.losses);
    const teamData = {
      ...newTeam,
      matches_played,
      points,
      league_name: activeLeague
    };

    try {
      const { data, error } = await supabase
        .from('league_table')
        .insert([teamData])
        .select();

      // Update localStorage
      const stored = localStorage.getItem("unity_league_standings");
      const currentList = stored ? JSON.parse(stored) : [];
      const newLocal = {
        id: data?.[0]?.id || `local-${Date.now()}`,
        ...teamData
      };
      const updatedList = [...currentList, newLocal];
      localStorage.setItem("unity_league_standings", JSON.stringify(updatedList));

      if (error) {
        console.error("Database table insertion failed, saved locally:", error.message);
        setStandings(updatedList);
      } else if (data) {
        setStandings(prev => [...prev, data[0]]);
      }

      toast.success(`${teamData.team_name} added to ${activeLeague}!`);
      setShowModal(false);
      setNewTeam({
        league_name: activeLeague,
        team_name: "",
        matches_played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        goal_difference: 0,
        points: 0
      });
    } catch (err) {
      console.error("Error adding team standings row:", err);
      toast.error("Failed to add team. Please try again.");
    }
  };

  const handleStartEdit = (team: TeamStanding) => {
    setEditingId(team.id);
    setEditingData({ ...team });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleSaveEdit = async () => {
    if (!editingData) return;

    // Recalculate matches played and points
    const { matches_played, points } = updateCalculations(editingData.wins, editingData.draws, editingData.losses);
    const updatedTeam = {
      ...editingData,
      matches_played,
      points
    };

    try {
      const { error } = await supabase
        .from('league_table')
        .update({
          team_name: updatedTeam.team_name,
          wins: updatedTeam.wins,
          draws: updatedTeam.draws,
          losses: updatedTeam.losses,
          matches_played: updatedTeam.matches_played,
          goal_difference: updatedTeam.goal_difference,
          points: updatedTeam.points
        })
        .eq('id', updatedTeam.id);

      // Update localStorage
      const stored = localStorage.getItem("unity_league_standings");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((item: TeamStanding) => item.id === updatedTeam.id ? updatedTeam : item);
        localStorage.setItem("unity_league_standings", JSON.stringify(updated));

        if (error) {
          console.error("Database standings update failed, updated locally:", error);
          setStandings(updated);
        }
      }

      if (!error) {
        setStandings(prev => prev.map(item => item.id === updatedTeam.id ? updatedTeam : item));
      }

      toast.success(`${updatedTeam.team_name} standings updated!`);
      setEditingId(null);
      setEditingData(null);
    } catch (err) {
      console.error("Error saving standing edit:", err);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete Team Standing",
      message: `Are you sure you want to remove "${name}" from the ${activeLeague} standings? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;

    try {
      const { error } = await supabase
        .from('league_table')
        .delete()
        .eq('id', id);

      // Update localStorage
      const stored = localStorage.getItem("unity_league_standings");
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((item: TeamStanding) => item.id !== id);
        localStorage.setItem("unity_league_standings", JSON.stringify(filtered));

        if (error) {
          console.error("Database standings row delete failed, deleted locally:", error);
          setStandings(filtered);
        }
      }

      if (!error) {
        setStandings(prev => prev.filter(item => item.id !== id));
      }
      toast.success(`"${name}" removed from standings.`);
    } catch (err) {
      console.error("Error deleting team standing:", err);
      toast.error("Failed to delete. Please try again.");
    }
  };

  const handleAddNewLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;
    
    if (!uniqueLeagues.includes(newLeagueName.trim())) {
      setUniqueLeagues(prev => [...prev, newLeagueName.trim()]);
    }
    setActiveLeague(newLeagueName.trim());
    setNewLeagueName("");
    setShowNewLeagueInput(false);
  };

  // Filter standings of the active league and sort them: points descending, then GD descending
  const currentStandings = standings
    .filter(item => item.league_name === activeLeague)
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.goal_difference - a.goal_difference;
    });

  return (
    <div className="space-y-10 transition-colors duration-500 relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">Add Team Standings</h2>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Team Name</label>
                <input 
                  type="text" 
                  value={newTeam.team_name}
                  onChange={(e) => setNewTeam({...newTeam, team_name: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Unity Academy"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Wins (W)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={newTeam.wins}
                    onChange={(e) => setNewTeam({...newTeam, wins: Number(e.target.value)})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Draws (D)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={newTeam.draws}
                    onChange={(e) => setNewTeam({...newTeam, draws: Number(e.target.value)})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Losses (L)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={newTeam.losses}
                    onChange={(e) => setNewTeam({...newTeam, losses: Number(e.target.value)})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Goal Difference (GD)</label>
                <input 
                  type="number" 
                  value={newTeam.goal_difference}
                  onChange={(e) => setNewTeam({...newTeam, goal_difference: Number(e.target.value)})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. +14 or -2"
                  required
                />
              </div>

              <div className="p-4 bg-foreground/5 dark:bg-white/5 rounded-xl text-[10px] text-foreground/60 dark:text-white/60 font-bold uppercase tracking-widest space-y-1">
                <div className="flex justify-between">
                  <span>Calculated Matches Played (P):</span>
                  <span className="text-foreground dark:text-white font-black">{newTeam.wins + newTeam.draws + newTeam.losses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Points (PTS):</span>
                  <span className="text-secondary font-black">{newTeam.wins * 3 + newTeam.draws}</span>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-foreground/10 dark:bg-white/10 text-foreground dark:text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-foreground/20 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20"
                >
                  Add Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors">League Standings.</h1>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">Manage clubs, log match records, track goal differences, and auto-calculate league standing tables.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-3 bg-secondary text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 animate-pulse"
        >
          <Plus className="w-4 h-4" />
          <span>Add Standing Team</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* League Selector Column */}
        <div className="lg:col-span-1 space-y-6">
           <LiquidGlassCard className="p-8 space-y-6">
              <h3 className="text-foreground dark:text-white font-bold text-sm tracking-tight transition-colors">Active League</h3>
              <div className="space-y-2">
                 {uniqueLeagues.map((league) => (
                   <button
                     key={league}
                     onClick={() => setActiveLeague(league)}
                     className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                       activeLeague === league
                         ? "bg-secondary text-white"
                         : "text-foreground/60 dark:text-white/60 hover:bg-foreground/5 dark:hover:bg-white/5"
                     }`}
                   >
                     <span>{league}</span>
                     <Trophy className="w-3 h-3 opacity-60" />
                   </button>
                 ))}
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                {!showNewLeagueInput ? (
                  <button 
                    onClick={() => setShowNewLeagueInput(true)}
                    className="w-full py-3 bg-foreground/5 dark:bg-white/5 border border-border text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary hover:text-white hover:border-secondary transition-all flex items-center justify-center space-x-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create League</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddNewLeague} className="space-y-2">
                    <input 
                      type="text" 
                      value={newLeagueName}
                      onChange={(e) => setNewLeagueName(e.target.value)}
                      placeholder="e.g. U15 Academy Cup"
                      className="w-full p-3 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-xs text-foreground dark:text-white focus:outline-none focus:border-secondary outline-none transition-colors"
                      required
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button 
                        type="button" 
                        onClick={() => setShowNewLeagueInput(false)}
                        className="flex-1 py-2 bg-foreground/10 dark:bg-white/10 text-foreground dark:text-white font-bold text-[9px] uppercase tracking-widest rounded-lg"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-2 bg-secondary text-white font-bold text-[9px] uppercase tracking-widest rounded-lg"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                )}
              </div>
           </LiquidGlassCard>
        </div>

        {/* Standings Table Control Column */}
        <div className="lg:col-span-3 space-y-6">
           <LiquidGlassCard className="p-8 space-y-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border pb-4 transition-colors">
                <div>
                   <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight transition-colors">{activeLeague}</h3>
                   <p className="text-[10px] text-foreground/40 dark:text-white/40 uppercase tracking-widest font-black transition-colors">Live Control Matrix</p>
                </div>
                <span className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">
                   {currentStandings.length} Teams Registered
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                    <span>Fetching standings...</span>
                  </div>
                </div>
              ) : currentStandings.length === 0 ? (
                <div className="p-12 text-center text-foreground/40 dark:text-white/40 text-sm">
                  No teams in this league yet. Click &quot;Add Standing Team&quot; above to seed the standings list.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold text-foreground/60 dark:text-white/60">
                    <thead>
                      <tr className="border-b border-border text-[9px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-widest">
                        <th className="py-3 px-2 text-center w-12">Rank</th>
                        <th className="py-3 px-4">Club</th>
                        <th className="py-3 px-2 text-center w-12">P</th>
                        <th className="py-3 px-2 text-center w-12">W</th>
                        <th className="py-3 px-2 text-center w-12">D</th>
                        <th className="py-3 px-2 text-center w-12">L</th>
                        <th className="py-3 px-2 text-center w-16">GD</th>
                        <th className="py-3 px-2 text-center w-16 text-secondary font-black">PTS</th>
                        <th className="py-3 px-4 text-right w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {currentStandings.map((team, index) => {
                        const isEditing = editingId === team.id;
                        return (
                          <tr key={team.id} className={`hover:bg-foreground/5 dark:hover:bg-white/5 transition-colors ${team.team_name.includes("Unity") ? "text-foreground dark:text-white bg-secondary/5" : ""}`}>
                            <td className="py-4 px-2 text-center font-black text-sm">
                              {index + 1}
                            </td>
                            <td className="py-4 px-4 font-bold text-sm">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editingData?.team_name || ""}
                                  onChange={(e) => setEditingData(prev => prev ? { ...prev, team_name: e.target.value } : null)}
                                  className="w-full p-2 bg-foreground/10 dark:bg-white/10 border border-border rounded text-xs text-foreground dark:text-white focus:outline-none"
                                />
                              ) : (
                                <span>{team.team_name}</span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-center text-sm font-semibold">
                              {isEditing ? (
                                <span className="opacity-50">
                                  {Number(editingData?.wins || 0) + Number(editingData?.draws || 0) + Number(editingData?.losses || 0)}
                                </span>
                              ) : (
                                <span>{team.matches_played}</span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  min="0"
                                  value={editingData?.wins ?? 0}
                                  onChange={(e) => setEditingData(prev => prev ? { ...prev, wins: Number(e.target.value) } : null)}
                                  className="w-12 p-1 bg-foreground/10 dark:bg-white/10 border border-border rounded text-center text-xs text-foreground dark:text-white"
                                />
                              ) : (
                                <span>{team.wins}</span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  min="0"
                                  value={editingData?.draws ?? 0}
                                  onChange={(e) => setEditingData(prev => prev ? { ...prev, draws: Number(e.target.value) } : null)}
                                  className="w-12 p-1 bg-foreground/10 dark:bg-white/10 border border-border rounded text-center text-xs text-foreground dark:text-white"
                                />
                              ) : (
                                <span>{team.draws}</span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  min="0"
                                  value={editingData?.losses ?? 0}
                                  onChange={(e) => setEditingData(prev => prev ? { ...prev, losses: Number(e.target.value) } : null)}
                                  className="w-12 p-1 bg-foreground/10 dark:bg-white/10 border border-border rounded text-center text-xs text-foreground dark:text-white"
                                />
                              ) : (
                                <span>{team.losses}</span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editingData?.goal_difference ?? 0}
                                  onChange={(e) => setEditingData(prev => prev ? { ...prev, goal_difference: Number(e.target.value) } : null)}
                                  className="w-16 p-1 bg-foreground/10 dark:bg-white/10 border border-border rounded text-center text-xs text-foreground dark:text-white"
                                />
                              ) : (
                                <span className={team.goal_difference > 0 ? "text-primary" : team.goal_difference < 0 ? "text-destructive" : ""}>
                                  {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-center text-sm font-black text-secondary">
                              {isEditing ? (
                                <span>
                                  {Number(editingData?.wins || 0) * 3 + Number(editingData?.draws || 0)}
                                </span>
                              ) : (
                                <span>{team.points}</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {isEditing ? (
                                  <>
                                    <button 
                                      onClick={handleSaveEdit}
                                      className="p-2 bg-secondary text-white rounded-lg hover:scale-105 transition-all"
                                      title="Save Changes"
                                    >
                                      <Save className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={handleCancelEdit}
                                      className="p-2 bg-foreground/10 dark:bg-white/10 text-foreground dark:text-white rounded-lg hover:bg-foreground/20 dark:hover:bg-white/20 transition-all"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => handleStartEdit(team)}
                                      className="p-2 bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-white/60 rounded-lg hover:text-secondary hover:bg-secondary/15 transition-all"
                                      title="Edit Standings"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteTeam(team.id, team.team_name)}
                                      className="p-2 bg-foreground/5 dark:bg-white/5 text-foreground/40 dark:text-white/40 rounded-lg hover:text-destructive hover:bg-destructive/15 transition-all"
                                      title="Delete Team"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
           </LiquidGlassCard>
        </div>
      </div>

      {/* Set Player of the Month Configuration Section */}
      <div className="pt-6 border-t border-border/30">
        <LiquidGlassCard className="p-8 space-y-6">
          <div className="flex items-center space-x-3 border-b border-border pb-4">
            <Award className="w-6 h-6 text-unity-gold" />
            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight">Set Player of the Month</h3>
              <p className="text-[10px] text-foreground/40 dark:text-white/40 uppercase tracking-widest font-black">Feature Configurator</p>
            </div>
          </div>

          <form onSubmit={handleSavePlayerOfTheMonth} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Select Player</label>
                  <select 
                    value={potmPlayerId}
                    onChange={(e) => setPotmPlayerId(e.target.value)}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled className="bg-background">-- Select Registered Player --</option>
                    {players.map(p => (
                      <option key={p.id} value={p.id} className="bg-background">
                        {p.name} ({p.squad})
                      </option>
                    ))}
                  </select>
                  {players.length === 0 && (
                    <p className="text-[10px] text-primary font-bold">No active players found in player registry. Go to Player Registry tab to create one.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Month & Year</label>
                  <input 
                    type="text" 
                    value={potmMonth}
                    onChange={(e) => setPotmMonth(e.target.value)}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    placeholder="e.g. May 2026"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Display Position / Role</label>
                <input 
                  type="text" 
                  value={potmPosition}
                  onChange={(e) => setPotmPosition(e.target.value)}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Forward / Striker"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Achievements & Bio</label>
                <textarea 
                  value={potmBio}
                  onChange={(e) => setPotmBio(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors resize-none"
                  placeholder="Provide a detailed description of the player's achievements, skills, work ethic, and goal statistics this month..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest block">Custom POTM Photo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePotmImageUpload}
                  className="w-full text-xs text-foreground/60 dark:text-white/60 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-foreground/10 file:text-foreground dark:file:bg-white/10 dark:file:text-white hover:file:bg-foreground/20 cursor-pointer"
                />
                <p className="text-[9px] text-foreground/30 dark:text-white/30 italic">Upload a custom photo for Player of the Month showcase. If not uploaded, the player&apos;s registry image will be used.</p>
                {potmImagePreview && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-border relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={potmImagePreview} alt="POTM Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="px-8 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20"
                >
                  Save Player of the Month
                </button>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-1 border border-border rounded-2xl p-6 bg-foreground/[0.02] space-y-4">
              <h4 className="text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-widest">Homepage Preview Widget</h4>
              
              {(() => {
                const selected = players.find(p => p.id === potmPlayerId);
                if (!selected) {
                  return (
                    <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-xl text-foreground/40 dark:text-white/40 text-xs font-bold">
                      Select a player to show preview
                    </div>
                  );
                }
                return (
                  <div className="space-y-4">
                    <div className="relative h-44 rounded-xl overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={potmImagePreview || selected.image} 
                        alt={selected.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 left-3 px-2 py-1 glass border border-unity-gold/50 rounded-lg text-[8px] font-black text-unity-gold uppercase tracking-wider">
                        {potmMonth}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[9px] font-black text-unity-gold uppercase tracking-widest">
                        {selected.squad} • {potmPosition}
                      </div>
                      <h4 className="text-lg font-black text-foreground dark:text-white tracking-tight">{selected.name}</h4>
                      <p className="text-xs text-foreground/60 dark:text-white/60 leading-relaxed line-clamp-3">
                        &ldquo;{potmBio || "No bio achievements filled in yet. Write details in the text area to show here..."}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </form>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
