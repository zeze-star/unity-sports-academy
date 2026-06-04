"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  Trophy, 
  Plus, 
  Activity,
  History,
  Trash2,
  Calendar,
  MapPin,
  Loader2,
  Edit2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast, useConfirm } from "@/components/providers/ToastProvider";

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  status: string;
  match_time: string;
  venue: string;
  competition: string;
}

export default function FixturesResultsManager() {
  const toast = useToast();
  const confirm = useConfirm();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  
  // Results submission state
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  
  // New fixture modal state
  const [showModal, setShowModal] = useState(false);
  const [newFixture, setNewFixture] = useState({
    team_a: 'Unity Sports Academy',
    team_b: '',
    competition: '',
    venue: '',
    date: '',
    time: '',
    status: 'UPCOMING'
  });

  // Edit fixture modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editFixtureDate, setEditFixtureDate] = useState('');
  const [editFixtureTime, setEditFixtureTime] = useState('');

  useEffect(() => {
    async function fetchMatches() {
      try {
        const stored = localStorage.getItem("unity_matches");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
            const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
            
            let filtered = parsed.filter((m: Match) => !deletedIds.includes(m.id));
            filtered = filtered.map((m: Match) => editedMatches[m.id] ? { ...m, ...editedMatches[m.id] } : m);
            
            setMatches(filtered);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .order('match_time', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
          const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
          
          let filtered = data.filter((m: Match) => !deletedIds.includes(m.id));
          filtered = filtered.map((m: Match) => editedMatches[m.id] ? { ...m, ...editedMatches[m.id] } : m);
          
          setMatches(filtered);
          localStorage.setItem("unity_matches", JSON.stringify(data));
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

    function loadFallback() {
      try {
        const stored = localStorage.getItem("unity_matches");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
            const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
            
            let filtered = parsed.filter((m: Match) => !deletedIds.includes(m.id));
            filtered = filtered.map((m: Match) => editedMatches[m.id] ? { ...m, ...editedMatches[m.id] } : m);
            
            setMatches(filtered);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading localStorage matches:", e);
      }

      // Hardcoded fallback data
      const defaultMatches = [
        {
          id: "m-1",
          status: "RESULT",
          team_a: "Unity U19",
          team_b: "Gor Mahia Youth",
          score_a: 2,
          score_b: 1,
          match_time: new Date().toISOString(),
          venue: "Tatu City Stadium",
          competition: "Premier Youth League"
        },
        {
          id: "m-2",
          status: "UPCOMING",
          team_a: "Unity Elite",
          team_b: "Kariobangi Sharks",
          score_a: 0,
          score_b: 0,
          match_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Main Pitch",
          competition: "Regional Cup"
        },
        {
          id: "m-3",
          status: "UPCOMING",
          team_a: "Unity Ladies",
          team_b: "Mathare Ladies",
          score_a: 0,
          score_b: 0,
          match_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Main Pitch A",
          competition: "FKF Division One"
        }
      ];
      
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
      const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
      
      let filtered = defaultMatches.filter((m: Match) => !deletedIds.includes(m.id));
      filtered = filtered.map((m: Match) => editedMatches[m.id] ? { ...m, ...editedMatches[m.id] } : m);
      
      setMatches(filtered);
      localStorage.setItem("unity_matches", JSON.stringify(filtered));
    }

    fetchMatches();
  }, []);

  const handleAddFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFixture.team_b || !newFixture.competition || !newFixture.date || !newFixture.time) {
      toast.error("Please fill in all fields.");
      return;
    }

    const matchTime = new Date(`${newFixture.date}T${newFixture.time}`).toISOString();
    const newId = `local-${Date.now()}`;
    
    const matchData = {
      team_a: newFixture.team_a,
      team_b: newFixture.team_b,
      score_a: 0,
      score_b: 0,
      status: newFixture.status,
      match_time: matchTime,
      venue: newFixture.venue || "Tatu City Stadium",
      competition: newFixture.competition
    };

    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([matchData])
        .select();

      // Update localStorage immediately
      const stored = localStorage.getItem("unity_matches");
      const currentList = stored ? JSON.parse(stored) : [];
      const newLocal = {
        id: data?.[0]?.id || newId,
        ...matchData
      };
      const updatedList = [newLocal, ...currentList];
      localStorage.setItem("unity_matches", JSON.stringify(updatedList));
      setMatches(updatedList);

      if (error) {
        console.error("Database fixture insertion failed, saved locally:", error.message);
      }

      setShowModal(false);
      setNewFixture({
        team_a: 'Unity Sports Academy',
        team_b: '',
        competition: '',
        venue: '',
        date: '',
        time: '',
        status: 'UPCOMING'
      });
      toast.success(`Fixture against "${matchData.team_b}" added successfully!`);
    } catch (err) {
      console.error("Error adding fixture:", err);
      toast.error("Failed to add fixture.");
    }
  };

  const handleResultSubmit = async () => {
    if (!selectedMatchId || scoreA === '' || scoreB === '') {
      toast.error("Please select a match and enter both scores.");
      return;
    }

    const sA = parseInt(scoreA);
    const sB = parseInt(scoreB);

    try {
      // 1. Track in unity_edited_matches in localStorage
      const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
      const currentMatch = matches.find(m => m.id === selectedMatchId);
      editedMatches[selectedMatchId] = {
        ...(currentMatch || {}),
        score_a: sA,
        score_b: sB,
        status: 'RESULT'
      };
      localStorage.setItem("unity_edited_matches", JSON.stringify(editedMatches));

      // 2. Update local unity_matches list
      const stored = localStorage.getItem("unity_matches");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((m: Match) => {
          if (m.id === selectedMatchId) {
            return { ...m, score_a: sA, score_b: sB, status: 'RESULT' };
          }
          return m;
        });
        localStorage.setItem("unity_matches", JSON.stringify(updated));
      }

      // 3. Update state
      setMatches(prev => prev.map(m => {
        if (m.id === selectedMatchId) {
          return { ...m, score_a: sA, score_b: sB, status: 'RESULT' };
        }
        return m;
      }));

      // 4. Try remote DB update
      const { error } = await supabase
        .from('matches')
        .update({ score_a: sA, score_b: sB, status: 'RESULT' })
        .eq('id', selectedMatchId);

      if (error) {
        console.error("Database result update failed, updated locally and stored in local storage:", error.message);
      }

      setSelectedMatchId('');
      setScoreA('');
      setScoreB('');
      toast.success("Official Result Submitted Successfully!");
    } catch (err: unknown) {
      toast.error("Failed to submit result: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteMatch = async (match: Match) => {
    const confirmed = await confirm(`Are you sure you want to delete the match "${match.team_a} vs ${match.team_b}"?`);
    if (!confirmed) return;
    try {
      // 1. Add to unity_deleted_matches in localStorage
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_matches") || "[]");
      if (!deletedIds.includes(match.id)) {
        deletedIds.push(match.id);
        localStorage.setItem("unity_deleted_matches", JSON.stringify(deletedIds));
      }

      // 2. Remove from local unity_matches list if exists
      const stored = localStorage.getItem("unity_matches");
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((m: Match) => m.id !== match.id);
        localStorage.setItem("unity_matches", JSON.stringify(filtered));
      }

      // 3. Update active state
      setMatches(prev => prev.filter(m => m.id !== match.id));

      // 4. Try remote DB deletion
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', match.id);

      if (error) {
        console.error("Database deletion failed, tracked in local storage:", error.message);
      }
      toast.success(`Match "${match.team_a} vs ${match.team_b}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting match:", err);
      toast.error("Failed to delete match.");
    }
  };

  const handleEditFixtureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch || !editingMatch.team_a || !editingMatch.team_b) return;

    const matchTime = (editFixtureDate && editFixtureTime) 
      ? new Date(`${editFixtureDate}T${editFixtureTime}`).toISOString() 
      : editingMatch.match_time;

    const updatedMatch: Match = {
      ...editingMatch,
      match_time: matchTime
    };

    try {
      // 1. Track in unity_edited_matches in localStorage
      const editedMatches = JSON.parse(localStorage.getItem("unity_edited_matches") || "{}");
      editedMatches[updatedMatch.id] = {
        team_a: updatedMatch.team_a,
        team_b: updatedMatch.team_b,
        competition: updatedMatch.competition,
        venue: updatedMatch.venue,
        score_a: updatedMatch.score_a,
        score_b: updatedMatch.score_b,
        status: updatedMatch.status,
        match_time: updatedMatch.match_time
      };
      localStorage.setItem("unity_edited_matches", JSON.stringify(editedMatches));

      // 2. Update local unity_matches list
      const stored = localStorage.getItem("unity_matches");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedList = parsed.map((m: Match) => m.id === updatedMatch.id ? updatedMatch : m);
        localStorage.setItem("unity_matches", JSON.stringify(updatedList));
      }

      // 3. Update state
      setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));

      // 4. Try remote DB update
      const { error } = await supabase
        .from('matches')
        .update({
          team_a: updatedMatch.team_a,
          team_b: updatedMatch.team_b,
          competition: updatedMatch.competition,
          venue: updatedMatch.venue,
          score_a: updatedMatch.score_a,
          score_b: updatedMatch.score_b,
          status: updatedMatch.status,
          match_time: updatedMatch.match_time
        })
        .eq('id', updatedMatch.id);

      if (error) {
        console.error("Supabase update error, saved locally:", error.message);
      }

      setShowEditModal(false);
      setEditingMatch(null);
      toast.success("Fixture updated successfully!");
    } catch (err) {
      console.error("Error editing fixture:", err);
      toast.error("Failed to edit fixture.");
    }
  };

  const activeMatchesForResults = matches.filter(m => m.status !== 'RESULT');

  const filteredMatches = matches.filter(m => {
    if (activeTab === "All") return true;
    return m.status?.toUpperCase() === activeTab.toUpperCase();
  });

  return (
    <div className="space-y-10 transition-colors duration-500 relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">New Fixture</h2>
            <form onSubmit={handleAddFixture} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Team A (Home)</label>
                <input 
                  type="text" 
                  value={newFixture.team_a}
                  onChange={(e) => setNewFixture({...newFixture, team_a: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="Home team"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Team B (Away / Opponent)</label>
                <input 
                  type="text" 
                  value={newFixture.team_b}
                  onChange={(e) => setNewFixture({...newFixture, team_b: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Gor Mahia Youth"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Competition</label>
                <input 
                  type="text" 
                  value={newFixture.competition}
                  onChange={(e) => setNewFixture({...newFixture, competition: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Premier Youth League"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Venue</label>
                <input 
                  type="text" 
                  value={newFixture.venue}
                  onChange={(e) => setNewFixture({...newFixture, venue: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Tatu City Stadium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Date</label>
                  <input 
                    type="date" 
                    value={newFixture.date}
                    onChange={(e) => setNewFixture({...newFixture, date: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Time</label>
                  <input 
                    type="time" 
                    value={newFixture.time}
                    onChange={(e) => setNewFixture({...newFixture, time: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Initial Status</label>
                <select 
                  value={newFixture.status}
                  onChange={(e) => setNewFixture({...newFixture, status: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="UPCOMING" className="bg-background">Upcoming</option>
                  <option value="LIVE" className="bg-background">Live</option>
                </select>
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
                  Create Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors">Fixtures & Results.</h1>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">Manage match dates, venues, squad opponents, and input official scores.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-3 bg-secondary text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Fixture</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-2 bg-foreground/5 dark:bg-white/5 border border-border p-1 rounded-xl">
                 {["All", "Upcoming", "Result", "Live"].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                       activeTab === tab
                         ? "bg-secondary text-white shadow-md shadow-secondary/15"
                         : "text-foreground/50 dark:text-white/50 hover:text-foreground dark:hover:text-white"
                     }`}
                   >
                     {tab === "Result" ? "Results" : tab}
                   </button>
                 ))}
              </div>
              <span className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">
                {filteredMatches.length} Matches Found
              </span>
           </div>

           <div className="space-y-4">
              {loading && (
                <div className="p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                    <span>Loading fixtures...</span>
                  </div>
                </div>
              )}
              {!loading && filteredMatches.length === 0 && (
                <div className="p-8 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 text-sm">
                  No matches found for this category. Click &quot;New Fixture&quot; to schedule one.
                </div>
              )}
              {!loading && filteredMatches.map((match) => (
                <LiquidGlassCard key={match.id} className="p-8 group hover:border-secondary/20 transition-all">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center space-x-6">
                         <div className="w-16 h-16 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-border flex items-center justify-center transition-colors">
                            <Trophy className="w-8 h-8 text-secondary" />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight transition-colors">
                              {match.team_a} vs {match.team_b}
                            </h3>
                            <div className="flex items-center space-x-3">
                               <span className="text-[10px] text-secondary font-black uppercase tracking-widest">{match.competition}</span>
                               <span className="text-foreground/20 dark:text-white/20 text-[10px]">•</span>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${match.status === 'LIVE' ? 'text-primary' : 'text-foreground/40 dark:text-white/40'}`}>
                                 {match.status}
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="flex-1 max-w-xs space-y-2">
                         <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest transition-colors">
                            <span className="text-foreground/20 dark:text-white/20">Venue & Date</span>
                         </div>
                         <div className="flex flex-col space-y-1 text-xs text-foreground/60 dark:text-white/60 font-bold transition-colors">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-secondary" />
                              <span>{match.venue || "Tatu City Stadium"}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-secondary" />
                              <span>{new Date(match.match_time).toLocaleDateString()} at {new Date(match.match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </span>
                         </div>
                      </div>

                      <div className="flex items-center space-x-6">
                         {match.status === 'RESULT' && (
                           <div className="px-4 py-2 glass rounded-xl font-black text-lg text-foreground dark:text-white transition-colors">
                             {match.score_a} : {match.score_b}
                           </div>
                         )}
                         <button 
                           onClick={() => {
                             setEditingMatch(match);
                             if (match.match_time) {
                               const dt = new Date(match.match_time);
                               const localDate = dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
                               const localTime = String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0');
                               setEditFixtureDate(localDate);
                               setEditFixtureTime(localTime);
                             } else {
                               setEditFixtureDate('');
                               setEditFixtureTime('');
                             }
                             setShowEditModal(true);
                           }}
                           className="p-3 rounded-xl hover:bg-foreground/10 dark:hover:bg-white/10 text-foreground/20 dark:text-white/20 hover:text-foreground dark:hover:text-white transition-all cursor-pointer"
                           title="Edit Match"
                         >
                            <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDeleteMatch(match)}
                           className="p-3 rounded-xl hover:bg-destructive/10 text-foreground/20 dark:text-white/20 hover:text-destructive transition-all cursor-pointer"
                           title="Delete Match"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </LiquidGlassCard>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <LiquidGlassCard className="p-10 space-y-8">
              <h3 className="text-lg font-black text-foreground dark:text-white tracking-tight flex items-center space-x-3 transition-colors">
                 <History className="w-5 h-5 text-secondary" />
                 <span>Result Entry</span>
              </h3>
              <div className="space-y-6">
                 {activeMatchesForResults.length === 0 ? (
                   <div className="p-6 text-center glass rounded-2xl text-foreground/40 dark:text-white/40 text-xs">
                     No upcoming/live matches available for score entry.
                   </div>
                 ) : (
                   <div className="p-6 glass border-border rounded-2xl space-y-6 transition-colors">
                     <div className="space-y-2 pb-4 border-b border-border">
                        <label className="text-[10px] text-foreground/40 dark:text-white/40 font-black uppercase tracking-widest">Select Match</label>
                        <select
                          value={selectedMatchId}
                          onChange={(e) => setSelectedMatchId(e.target.value)}
                          className="w-full p-3 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-xs text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                        >
                          <option value="" className="bg-background">Select a match...</option>
                          {activeMatchesForResults.map(m => (
                            <option key={m.id} value={m.id} className="bg-background">
                              {m.team_a} vs {m.team_b} ({m.competition})
                            </option>
                          ))}
                        </select>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-[8px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest text-center max-w-[80px] truncate">
                            {selectedMatchId ? matches.find(m => m.id === selectedMatchId)?.team_a : "Home"}
                          </span>
                          <input 
                            type="number" 
                            value={scoreA}
                            onChange={(e) => setScoreA(e.target.value)}
                            placeholder="0" 
                            className="w-16 h-16 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-2xl font-black text-foreground dark:text-white text-center focus:border-secondary transition-colors outline-none" 
                          />
                        </div>
                        <span className="text-2xl font-black text-foreground/20 dark:text-white/20 transition-colors">:</span>
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-[8px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest text-center max-w-[80px] truncate">
                            {selectedMatchId ? matches.find(m => m.id === selectedMatchId)?.team_b : "Away"}
                          </span>
                          <input 
                            type="number" 
                            value={scoreB}
                            onChange={(e) => setScoreB(e.target.value)}
                            placeholder="0" 
                            className="w-16 h-16 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-2xl font-black text-foreground dark:text-white text-center focus:border-secondary transition-colors outline-none" 
                          />
                        </div>
                     </div>
                     <button 
                       onClick={handleResultSubmit}
                       className="w-full py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20"
                     >
                        Submit Official Result
                     </button>
                   </div>
                 )}
              </div>
           </LiquidGlassCard>

           <div className="p-10 glass border border-border rounded-3xl space-y-6 transition-colors">
              <h3 className="text-foreground dark:text-white font-bold text-sm tracking-tight flex items-center space-x-3 transition-colors">
                 <Activity className="w-4 h-4 text-secondary" />
                 <span>Upcoming Deadlines</span>
              </h3>
              <div className="space-y-4">
                 {[
                   { t: "Roster Freeze", d: "May 25, 2026", color: "text-secondary" },
                   { t: "Match Kit Approval", d: "May 28, 2026", color: "text-foreground/40 dark:text-white/40" },
                   { t: "Venue Inspection", d: "May 30, 2026", color: "text-foreground/40 dark:text-white/40" }
                 ].map(item => (
                   <div key={item.t} className="flex flex-col space-y-1">
                      <p className="text-xs font-bold text-foreground dark:text-white transition-colors">{item.t}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${item.color}`}>{item.d}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Edit Fixture Modal */}
      {showEditModal && editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">Edit Fixture</h2>
            <form onSubmit={handleEditFixtureSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Team A (Home)</label>
                <input 
                  type="text" 
                  value={editingMatch.team_a}
                  onChange={(e) => setEditingMatch({...editingMatch, team_a: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="Home team"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Team B (Away / Opponent)</label>
                <input 
                  type="text" 
                  value={editingMatch.team_b}
                  onChange={(e) => setEditingMatch({...editingMatch, team_b: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="Away team"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Competition</label>
                <input 
                  type="text" 
                  value={editingMatch.competition}
                  onChange={(e) => setEditingMatch({...editingMatch, competition: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="Competition"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Venue</label>
                <input 
                  type="text" 
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({...editingMatch, venue: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="Venue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Date</label>
                  <input 
                    type="date" 
                    value={editFixtureDate}
                    onChange={(e) => setEditFixtureDate(e.target.value)}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Time</label>
                  <input 
                    type="time" 
                    value={editFixtureTime}
                    onChange={(e) => setEditFixtureTime(e.target.value)}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Home Score</label>
                  <input 
                    type="number" 
                    value={editingMatch.score_a}
                    onChange={(e) => setEditingMatch({...editingMatch, score_a: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Away Score</label>
                  <input 
                    type="number" 
                    value={editingMatch.score_b}
                    onChange={(e) => setEditingMatch({...editingMatch, score_b: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Status</label>
                <select 
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({...editingMatch, status: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="UPCOMING" className="bg-background">Upcoming</option>
                  <option value="LIVE" className="bg-background">Live</option>
                  <option value="RESULT" className="bg-background">Result</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMatch(null);
                  }}
                  className="flex-1 py-4 bg-foreground/10 dark:bg-white/10 text-foreground dark:text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-foreground/20 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
