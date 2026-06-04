"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  Trash2,
  Loader2,
  Edit2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast, useConfirm } from "@/components/providers/ToastProvider";

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

export default function ScheduleManager() {
  const toast = useToast();
  const confirm = useConfirm();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeGender, setActiveGender] = useState<string>("All");
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Interactive calendar states
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Starts in May 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [newSession, setNewSession] = useState({
    title: '',
    squad: 'Elite U18',
    venue: 'Pitch A',
    time: '08:00 AM - 10:00 AM',
    date: todayStr,
    gender: 'Men',
    type: 'Training',
    status: 'Upcoming'
  });

  useEffect(() => {
    async function fetchSessions() {
      try {
        const stored = localStorage.getItem("unity_sessions");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_sessions") || "[]");
            const editedSessions = JSON.parse(localStorage.getItem("unity_edited_sessions") || "{}");
            
            let filtered = parsed.filter((s: Session) => !deletedIds.includes(s.id));
            filtered = filtered.map((s: Session) => editedSessions[s.id] ? { ...s, ...editedSessions[s.id] } : s);
            
            setSessions(filtered);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_sessions") || "[]");
          const editedSessions = JSON.parse(localStorage.getItem("unity_edited_sessions") || "{}");
          
          let filtered = data.filter((s: Session) => !deletedIds.includes(s.id));
          filtered = filtered.map((s: Session) => editedSessions[s.id] ? { ...s, ...editedSessions[s.id] } : s);
          
          setSessions(filtered);
          localStorage.setItem("unity_sessions", JSON.stringify(data));
        } else {
          loadFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching sessions, checking fallback:', err instanceof Error ? err.message : 'Network error');
        loadFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadFallback() {
      try {
        const stored = localStorage.getItem("unity_sessions");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_sessions") || "[]");
            const editedSessions = JSON.parse(localStorage.getItem("unity_edited_sessions") || "{}");
            
            let filtered = parsed.filter((s: Session) => !deletedIds.includes(s.id));
            filtered = filtered.map((s: Session) => editedSessions[s.id] ? { ...s, ...editedSessions[s.id] } : s);
            
            setSessions(filtered);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading localStorage sessions:", e);
      }

      // Hardcoded fallback data
      const defaultSessions = [
        {
          id: "s-1",
          title: "Tactical & Position Play",
          squad: "Elite U18",
          venue: "Pitch A",
          time: "08:00 AM - 10:00 AM",
          date: "2026-05-08",
          gender: "Men",
          type: "Training",
          status: "Upcoming"
        },
        {
          id: "s-2",
          title: "Physical Conditioning",
          squad: "U17 Academy",
          venue: "Pitch B",
          time: "10:30 AM - 12:00 PM",
          date: "2026-05-08",
          gender: "Men",
          type: "Training",
          status: "Upcoming"
        },
        {
          id: "s-3",
          title: "Goalkeeper Drills",
          squad: "All Squads",
          venue: "Goal Lab",
          time: "02:00 PM - 03:30 PM",
          date: "2026-05-12",
          gender: "Men",
          type: "Specialized",
          status: "Upcoming"
        }
      ];

      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_sessions") || "[]");
      const editedSessions = JSON.parse(localStorage.getItem("unity_edited_sessions") || "{}");
      
      let filtered = defaultSessions.filter((s: Session) => !deletedIds.includes(s.id));
      filtered = filtered.map((s: Session) => editedSessions[s.id] ? { ...s, ...editedSessions[s.id] } : s);

      setSessions(filtered);
      localStorage.setItem("unity_sessions", JSON.stringify(filtered));
    }

    fetchSessions();

    const channel = supabase
      .channel('schema-db-changes-sessions-admin')
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
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.title) return;
    const newId = `local-${Date.now()}`;

    const sessionData = {
      title: newSession.title,
      squad: newSession.squad,
      venue: newSession.venue,
      time: newSession.time,
      date: newSession.date,
      gender: newSession.gender,
      type: newSession.type,
      status: newSession.status
    };

    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select();

      // Update localStorage immediately
      const stored = localStorage.getItem("unity_sessions");
      const currentList = stored ? JSON.parse(stored) : [];
      const newLocal = {
        id: data?.[0]?.id || newId,
        ...sessionData
      };
      const updatedList = [newLocal, ...currentList];
      localStorage.setItem("unity_sessions", JSON.stringify(updatedList));
      setSessions(updatedList);

      if (error) {
        console.error("Database scheduling failed, saved locally:", error.message);
      }

      setShowModal(false);
      setNewSession({
        title: '',
        squad: 'Elite U18',
        venue: 'Pitch A',
        time: '08:00 AM - 10:00 AM',
        date: todayStr,
        gender: 'Men',
        type: 'Training',
        status: 'Upcoming'
      });
      toast.success(`Training session "${newLocal.title}" scheduled successfully!`);
    } catch (err) {
      console.error("Error adding session:", err);
      toast.error("Failed to add session.");
    }
  };

  const handleDeleteSession = async (session: Session) => {
    const confirmed = await confirm(`Are you sure you want to delete session "${session.title}"?`);
    if (!confirmed) return;
    try {
      // 1. Add to unity_deleted_sessions in localStorage
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_sessions") || "[]");
      if (!deletedIds.includes(session.id)) {
        deletedIds.push(session.id);
        localStorage.setItem("unity_deleted_sessions", JSON.stringify(deletedIds));
      }

      // 2. Remove from local unity_sessions list if exists
      const stored = localStorage.getItem("unity_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((s: Session) => s.id !== session.id);
        localStorage.setItem("unity_sessions", JSON.stringify(filtered));
      }

      // 3. Update active state
      setSessions(prev => prev.filter(s => s.id !== session.id));

      // 4. Try remote DB deletion
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', session.id);

      if (error) {
        console.error("Database deletion failed, tracked in local storage:", error.message);
      }
      toast.success(`Session "${session.title}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error("Failed to delete session.");
    }
  };

  const handleEditSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editingSession.title) return;

    try {
      // 1. Track in unity_edited_sessions in localStorage
      const editedSessions = JSON.parse(localStorage.getItem("unity_edited_sessions") || "{}");
      editedSessions[editingSession.id] = {
        title: editingSession.title,
        squad: editingSession.squad,
        venue: editingSession.venue,
        time: editingSession.time,
        date: editingSession.date,
        gender: editingSession.gender,
        type: editingSession.type,
        status: editingSession.status
      };
      localStorage.setItem("unity_edited_sessions", JSON.stringify(editedSessions));

      // 2. Update local unity_sessions list
      const stored = localStorage.getItem("unity_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedList = parsed.map((s: Session) => s.id === editingSession.id ? editingSession : s);
        localStorage.setItem("unity_sessions", JSON.stringify(updatedList));
      }

      // 3. Update state
      setSessions(prev => prev.map(s => s.id === editingSession.id ? editingSession : s));

      // 4. Try remote DB update
      const { error } = await supabase
        .from('sessions')
        .update({
          title: editingSession.title,
          squad: editingSession.squad,
          venue: editingSession.venue,
          time: editingSession.time,
          date: editingSession.date,
          gender: editingSession.gender,
          type: editingSession.type,
          status: editingSession.status
        })
        .eq('id', editingSession.id);

      if (error) {
        console.error("Supabase update error, saved locally:", error.message);
      }

      setShowEditModal(false);
      setEditingSession(null);
      toast.success("Session updated successfully!");
    } catch (err) {
      console.error("Error editing session:", err);
      toast.error("Failed to edit session.");
    }
  };

  const filteredSessions = sessions.filter(s => {
    // Filter by gender tab first
    if (activeGender !== "All" && s.gender?.toLowerCase() !== activeGender.toLowerCase()) {
      return false;
    }
    // Filter by calendar selected date if set
    if (selectedDate) {
      if (s.date === selectedDate) return true;
      if (s.date && s.date.toLowerCase() === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return today === selectedDate;
      }
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-10 transition-colors duration-500 relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">New Session</h2>
            <form onSubmit={handleAddSession} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Session Title</label>
                <input 
                  type="text" 
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Tactical Training"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Squad</label>
                  <select 
                    value={newSession.squad}
                    onChange={(e) => setNewSession({...newSession, squad: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Elite U18" className="bg-background">Elite U18</option>
                    <option value="U17 Academy" className="bg-background">U17 Academy</option>
                    <option value="U15 Academy" className="bg-background">U15 Academy</option>
                    <option value="U13 Foundation" className="bg-background">U13 Foundation</option>
                    <option value="Senior Ladies" className="bg-background">Senior Ladies</option>
                    <option value="All Squads" className="bg-background">All Squads</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Gender Tag</label>
                  <select 
                    value={newSession.gender}
                    onChange={(e) => setNewSession({...newSession, gender: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Men" className="bg-background">Men</option>
                    <option value="Women" className="bg-background">Women</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Session Type</label>
                  <select 
                    value={newSession.type}
                    onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Training" className="bg-background">Training</option>
                    <option value="Match" className="bg-background">Match</option>
                    <option value="Specialized" className="bg-background">Specialized</option>
                    <option value="Foundation" className="bg-background">Foundation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Status</label>
                  <select 
                    value={newSession.status}
                    onChange={(e) => setNewSession({...newSession, status: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Upcoming" className="bg-background">Upcoming</option>
                    <option value="Ongoing" className="bg-background">Ongoing</option>
                    <option value="Completed" className="bg-background">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Venue</label>
                <select 
                  value={newSession.venue}
                  onChange={(e) => setNewSession({...newSession, venue: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="Pitch A" className="bg-background">Pitch A</option>
                  <option value="Pitch B" className="bg-background">Pitch B</option>
                  <option value="Goal Lab" className="bg-background">Goal Lab</option>
                  <option value="Technical Lab" className="bg-background">Technical Lab</option>
                  <option value="Main Arena" className="bg-background">Main Arena</option>
                  <option value="Main Stadium" className="bg-background">Main Stadium</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Time Slot</label>
                <input 
                  type="text" 
                  value={newSession.time}
                  onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. 08:00 AM - 10:00 AM"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Date</label>
                <input 
                  type="date" 
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  required
                />
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">Edit Session</h2>
            <form onSubmit={handleEditSessionSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Session Title</label>
                <input 
                  type="text" 
                  value={editingSession.title || ""}
                  onChange={(e) => setEditingSession({...editingSession, title: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. Tactical Training"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Squad</label>
                  <select 
                    value={editingSession.squad || "Elite U18"}
                    onChange={(e) => setEditingSession({...editingSession, squad: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Elite U18" className="bg-background">Elite U18</option>
                    <option value="U17 Academy" className="bg-background">U17 Academy</option>
                    <option value="U15 Academy" className="bg-background">U15 Academy</option>
                    <option value="U13 Foundation" className="bg-background">U13 Foundation</option>
                    <option value="Senior Ladies" className="bg-background">Senior Ladies</option>
                    <option value="All Squads" className="bg-background">All Squads</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Gender Tag</label>
                  <select 
                    value={editingSession.gender || "Men"}
                    onChange={(e) => setEditingSession({...editingSession, gender: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Men" className="bg-background">Men</option>
                    <option value="Women" className="bg-background">Women</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Session Type</label>
                  <select 
                    value={editingSession.type || "Training"}
                    onChange={(e) => setEditingSession({...editingSession, type: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Training" className="bg-background">Training</option>
                    <option value="Match" className="bg-background">Match</option>
                    <option value="Specialized" className="bg-background">Specialized</option>
                    <option value="Foundation" className="bg-background">Foundation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Status</label>
                  <select 
                    value={editingSession.status || "Upcoming"}
                    onChange={(e) => setEditingSession({...editingSession, status: e.target.value})}
                    className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                  >
                    <option value="Upcoming" className="bg-background">Upcoming</option>
                    <option value="Ongoing" className="bg-background">Ongoing</option>
                    <option value="Completed" className="bg-background">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Venue</label>
                <select 
                  value={editingSession.venue || "Pitch A"}
                  onChange={(e) => setEditingSession({...editingSession, venue: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="Pitch A" className="bg-background">Pitch A</option>
                  <option value="Pitch B" className="bg-background">Pitch B</option>
                  <option value="Goal Lab" className="bg-background">Goal Lab</option>
                  <option value="Technical Lab" className="bg-background">Technical Lab</option>
                  <option value="Main Arena" className="bg-background">Main Arena</option>
                  <option value="Main Stadium" className="bg-background">Main Stadium</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Time Slot</label>
                <input 
                  type="text" 
                  value={editingSession.time || ""}
                  onChange={(e) => setEditingSession({...editingSession, time: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. 08:00 AM - 10:00 AM"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Date</label>
                <input 
                  type="date" 
                  value={editingSession.date || ""}
                  onChange={(e) => setEditingSession({...editingSession, date: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSession(null);
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

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors">Schedule <span className="text-foreground/20 dark:text-white/20">Manager.</span></h1>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">Orchestrate sessions, matches, and facility allocation.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-3 bg-foreground dark:bg-white text-background dark:text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white hover:border-secondary transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar Mini */}
        <div className="lg:col-span-1 space-y-6">
            <LiquidGlassCard className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 rounded hover:bg-foreground/5 dark:hover:bg-white/5 text-foreground/60 dark:text-white/60 text-xs font-bold">‹</button>
                   <h3 className="text-foreground dark:text-white font-bold text-xs tracking-tight transition-colors">
                     {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentDate.getMonth()]} {currentDate.getFullYear()}
                   </h3>
                   <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 rounded hover:bg-foreground/5 dark:hover:bg-white/5 text-foreground/60 dark:text-white/60 text-xs font-bold">›</button>
                 </div>
                 <CalendarIcon className="w-4 h-4 text-secondary" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                 {['S','M','T','W','T','F','S'].map((d, index) => (
                   <span key={`${d}-${index}`} className="text-[10px] font-black text-foreground/20 dark:text-white/20 transition-colors">{d}</span>
                 ))}
                 {(() => {
                   const year = currentDate.getFullYear();
                   const month = currentDate.getMonth();
                   const firstDayIndex = new Date(year, month, 1).getDay();
                   const numDays = new Date(year, month + 1, 0).getDate();
                   
                   const cells = [];
                   for (let i = 0; i < firstDayIndex; i++) {
                     cells.push(<span key={`empty-${i}`} />);
                   }
                   for (let i = 1; i <= numDays; i++) {
                     const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                     const isSelected = selectedDate === formatted;
                     
                     const hasSession = sessions.some(s => {
                       if (!s.date) return false;
                       if (s.date === formatted) return true;
                       if (s.date.toLowerCase() === 'today') {
                         const today = new Date().toISOString().split('T')[0];
                         return today === formatted;
                       }
                       return false;
                     });

                     cells.push(
                       <button 
                         key={formatted} 
                         onClick={() => setSelectedDate(prev => prev === formatted ? null : formatted)}
                         type="button"
                         className={`text-[10px] font-bold p-1 rounded-lg cursor-pointer transition-all relative flex flex-col items-center justify-center h-8 w-8 mx-auto ${
                           isSelected 
                             ? 'bg-secondary text-white shadow-md shadow-secondary/15' 
                             : 'text-foreground/60 dark:text-white/60 hover:bg-foreground/5 dark:hover:bg-white/5'
                         }`}
                       >
                         <span>{i}</span>
                         {hasSession && (
                           <span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1 animate-pulse" />
                         )}
                       </button>
                     );
                   }
                   return cells;
                 })()}
              </div>
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline mt-2 text-center w-full block transition-all"
                >
                  Clear Date Filter
                </button>
              )}
            </LiquidGlassCard>

           <div className="p-8 glass rounded-3xl border border-border space-y-4 transition-colors">
              <h4 className="text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-widest transition-colors">Facility Load</h4>
              <div className="space-y-4">
                 {['Pitch A', 'Pitch B', 'Tech Lab'].map((pitch, i) => (
                   <div key={pitch} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold transition-colors">
                         <span className="text-foreground/60 dark:text-white/60">{pitch}</span>
                         <span className="text-foreground/40 dark:text-white/40">{[80, 45, 90][i]}%</span>
                      </div>
                      <div className="h-1 bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                         <div className={`h-full ${[80, 45, 90][i] > 85 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: `${[80, 45, 90][i]}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Schedule Feed */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4">
              <div className="flex items-center space-x-3 bg-foreground/5 dark:bg-white/5 border border-border p-1 rounded-xl">
                 {["All", "Men", "Women"].map((g) => (
                   <button
                     key={g}
                     onClick={() => setActiveGender(g)}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                       activeGender === g
                         ? "bg-secondary text-white shadow-md shadow-secondary/15"
                         : "text-foreground/50 dark:text-white/50 hover:text-foreground dark:hover:text-white"
                     }`}
                   >
                     {g}
                   </button>
                 ))}
              </div>
              <span className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">
                {filteredSessions.length} Events Listed
              </span>
           </div>

           <div className="space-y-4">
              {loading && (
                <div className="p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                    <span>Loading schedule...</span>
                  </div>
                </div>
              )}
              {!loading && filteredSessions.length === 0 && (
                <div className="p-12 text-center glass rounded-3xl text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                  No scheduled sessions found for this category.
                </div>
              )}
              {!loading && filteredSessions.map((item, index) => (
                <LiquidGlassCard key={item.id || index} className="p-0 overflow-hidden group">
                   <div className="flex flex-col md:flex-row">
                      <div className={`w-2 ${item.status === 'Ongoing' ? 'bg-primary' : 'bg-secondary'} opacity-40 group-hover:opacity-100 transition-opacity`} />
                      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 items-center gap-8">
                         <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center space-x-3">
                               <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-foreground/5 dark:bg-white/5 border transition-colors ${item.type === 'Match' ? 'text-primary border-primary/20' : 'text-foreground/40 dark:text-white/40 border-border'}`}>
                                  {item.type}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border transition-colors ${
                                  item.gender?.toLowerCase() === 'women' ? 'bg-unity-gold/10 text-unity-gold border-unity-gold/20' : 'bg-foreground/5 dark:bg-white/5 text-foreground/50 dark:text-white/50 border-border'
                                }`}>
                                  {item.gender}
                                </span>
                                <span className="text-[10px] text-foreground/20 dark:text-white/20 font-bold transition-colors">{item.date}</span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight transition-colors">{item.title}</h3>
                         </div>

                         <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-foreground/40 dark:text-white/40 transition-colors">
                               <Clock className="w-4 h-4 text-secondary" />
                               <span className="text-xs font-bold">{item.time}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-foreground/40 dark:text-white/40 transition-colors">
                               <MapPin className="w-4 h-4 text-secondary" />
                               <span className="text-xs font-bold">{item.venue}</span>
                            </div>
                         </div>

                         <div className="flex items-center justify-between md:justify-end space-x-6">
                            <div className="text-right">
                               <div className="flex items-center space-x-2 justify-end">
                                  <Users className="w-3 h-3 text-foreground/20 dark:text-white/20 transition-colors" />
                                  <span className="text-xs font-bold text-foreground dark:text-white transition-colors">{item.squad}</span>
                                </div>
                               <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${item.status === 'Ongoing' ? 'text-primary' : 'text-foreground/20 dark:text-white/20'}`}>
                                  {item.status}
                                </span>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingSession(item);
                                setShowEditModal(true);
                              }}
                              className="p-3 rounded-xl hover:bg-foreground/10 dark:hover:bg-white/10 text-foreground/20 dark:text-white/20 hover:text-foreground dark:hover:text-white transition-all cursor-pointer mr-1"
                              title="Edit Session"
                            >
                               <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSession(item)}
                              className="p-3 rounded-xl hover:bg-destructive/10 text-foreground/20 dark:text-white/20 hover:text-destructive transition-all cursor-pointer"
                              title="Delete Session"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                </LiquidGlassCard>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
