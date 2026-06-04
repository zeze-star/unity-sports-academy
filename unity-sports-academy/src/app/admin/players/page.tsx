"use client";

import React, { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  UserPlus, 
  Search, 
  Filter, 
  Trash2,
  Loader2,
  Edit2
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useToast, useConfirm } from "@/components/providers/ToastProvider";

interface Player {
  id: string;
  name: string;
  squad: string;
  position: string;
  status: string;
  performance: number;
  image: string;
}

export default function PlayerRegistry() {
  const toast = useToast();
  const confirm = useConfirm();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', squad: 'U13 Foundation', position: 'Midfielder' });
  const [searchTerm, setSearchTerm] = useState('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const stored = localStorage.getItem("unity_players");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_players") || "[]");
            const editedPlayers = JSON.parse(localStorage.getItem("unity_edited_players") || "{}");
            
            let filtered = parsed.filter((p: Player) => !deletedIds.includes(p.id));
            filtered = filtered.map((p: Player) => editedPlayers[p.id] ? { ...p, ...editedPlayers[p.id] } : p);
            
            setPlayers(filtered);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedPlayers = data.map(p => ({
            id: p.player_id,
            name: p.name,
            squad: p.squad,
            position: p.position,
            status: p.status || 'Active',
            performance: p.performance || 75,
            image: p.image_url || "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=200&auto=format&fit=crop"
          }));
          
          const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_players") || "[]");
          const editedPlayers = JSON.parse(localStorage.getItem("unity_edited_players") || "{}");
          
          let filtered = formattedPlayers.filter((p: Player) => !deletedIds.includes(p.id));
          filtered = filtered.map((p: Player) => editedPlayers[p.id] ? { ...p, ...editedPlayers[p.id] } : p);
          
          setPlayers(filtered);
          localStorage.setItem("unity_players", JSON.stringify(formattedPlayers));
        } else {
          loadFallback();
        }
      } catch (err: unknown) {
        console.warn('Error fetching players, checking fallback:', err instanceof Error ? err.message : 'Network error');
        loadFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadFallback() {
      try {
        const stored = localStorage.getItem("unity_players");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setPlayers(parsed);
            return;
          }
        }
      } catch (e) {
        console.error("Error loading fallback players:", e);
      }
      setPlayers([]);
    }

    fetchPlayers();

    const channel = supabase
      .channel('schema-db-changes-players')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players'
        },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      
      // Compress image utilizing canvas to keep size light in the database
      const img = new window.Image();
      img.src = result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxW = 300;
        const scale = maxW / img.width;
        canvas.width = maxW;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        setImageBase64(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name) return;
    const playerId = `USA-${Math.floor(100 + Math.random() * 900)}`;
    const finalImage = imageBase64 || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop";

    const newPerformance = Math.floor(65 + Math.random() * 30);
    const playerData = {
      player_id: playerId,
      name: newPlayer.name,
      squad: newPlayer.squad,
      position: newPlayer.position,
      status: 'Active',
      performance: newPerformance,
      image_url: finalImage
    };

    try {
      const { error } = await supabase.from('players').insert([playerData]);
      
      // Always update localStorage list immediately
      const stored = localStorage.getItem("unity_players");
      const currentList = stored ? JSON.parse(stored) : [];
      const newLocalPlayer = {
        id: playerId,
        name: newPlayer.name,
        squad: newPlayer.squad,
        position: newPlayer.position,
        status: 'Active',
        performance: newPerformance,
        image: finalImage
      };
      const updatedList = [newLocalPlayer, ...currentList];
      localStorage.setItem("unity_players", JSON.stringify(updatedList));

      if (error) {
        console.error("Supabase insert error, saved locally:", error.message);
        setPlayers(updatedList);
      }
      
      setShowModal(false);
      setNewPlayer({ name: '', squad: 'U13 Foundation', position: 'Midfielder' });
      setImageBase64('');
      setImagePreview('');
      toast.success(`Player "${newLocalPlayer.name}" registered successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to register player.");
    }
  };

  const handleDeletePlayer = async (player: Player) => {
    const confirmed = await confirm(`Are you sure you want to delete ${player.name}?`);
    if (!confirmed) return;
    try {
      // 1. Add to unity_deleted_players in localStorage
      const deletedIds = JSON.parse(localStorage.getItem("unity_deleted_players") || "[]");
      if (!deletedIds.includes(player.id)) {
        deletedIds.push(player.id);
        localStorage.setItem("unity_deleted_players", JSON.stringify(deletedIds));
      }

      // 2. Remove from local unity_players list if exists
      const stored = localStorage.getItem("unity_players");
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((p: Player) => p.id !== player.id);
        localStorage.setItem("unity_players", JSON.stringify(filtered));
      }

      // 3. Update active state
      setPlayers(prev => prev.filter(p => p.id !== player.id));

      // 4. Try remote DB deletion
      const { error } = await supabase
          .from('players')
          .delete()
          .eq('player_id', player.id);

      if (error) {
        console.error("Database deletion failed, tracked in local storage:", error.message);
      }
      toast.success(`Player "${player.name}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting player:", err);
      toast.error("Failed to delete player.");
    }
  };

  const handleEditPlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !editingPlayer.name) return;

    const finalImage = imageBase64 || editingPlayer.image;

    const updatedPlayer: Player = {
      ...editingPlayer,
      image: finalImage
    };

    try {
      // 1. Track in unity_edited_players in localStorage
      const editedPlayers = JSON.parse(localStorage.getItem("unity_edited_players") || "{}");
      editedPlayers[updatedPlayer.id] = {
        name: updatedPlayer.name,
        squad: updatedPlayer.squad,
        position: updatedPlayer.position,
        status: updatedPlayer.status,
        performance: updatedPlayer.performance,
        image_url: finalImage
      };
      localStorage.setItem("unity_edited_players", JSON.stringify(editedPlayers));

      // 2. Update local unity_players list
      const stored = localStorage.getItem("unity_players");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedList = parsed.map((p: Player) => p.id === updatedPlayer.id ? updatedPlayer : p);
        localStorage.setItem("unity_players", JSON.stringify(updatedList));
      }

      // 3. Update state
      setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));

      // 4. Try remote DB update
      const { error } = await supabase
        .from('players')
        .update({
          name: updatedPlayer.name,
          squad: updatedPlayer.squad,
          position: updatedPlayer.position,
          status: updatedPlayer.status,
          performance: updatedPlayer.performance,
          image_url: finalImage
        })
        .eq('player_id', updatedPlayer.id);

      if (error) {
        console.error("Supabase update error, saved locally:", error.message);
      }

      setShowEditModal(false);
      setEditingPlayer(null);
      setImageBase64('');
      setImagePreview('');
      toast.success(`Player "${updatedPlayer.name}" profile updated successfully!`);
    } catch (err) {
      console.error("Error editing player:", err);
      toast.error("Failed to update player profile.");
    }
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 transition-colors duration-500 relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">Register New Player</h2>
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. David Maina"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest block">Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-foreground/60 dark:text-white/60 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-foreground/10 file:text-foreground dark:file:bg-white/10 dark:file:text-white hover:file:bg-foreground/20 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-border relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Squad</label>
                <select 
                  value={newPlayer.squad}
                  onChange={(e) => setNewPlayer({...newPlayer, squad: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="U13 Foundation" className="bg-background">U13 Foundation</option>
                  <option value="U15 Academy" className="bg-background">U15 Academy</option>
                  <option value="U17 Academy" className="bg-background">U17 Academy</option>
                  <option value="Elite U18" className="bg-background">Elite U18</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Position</label>
                <select 
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="Forward" className="bg-background">Forward</option>
                  <option value="Midfielder" className="bg-background">Midfielder</option>
                  <option value="Defender" className="bg-background">Defender</option>
                  <option value="Goalkeeper" className="bg-background">Goalkeeper</option>
                </select>
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setImageBase64('');
                    setImagePreview('');
                  }}
                  className="flex-1 py-4 bg-foreground/10 dark:bg-white/10 text-foreground dark:text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-foreground/20 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors">Player <span className="text-foreground/20 dark:text-white/20">Registry.</span></h1>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">Manage academy talent, profiles, and performance data.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-3 bg-secondary text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-secondary/20 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Player</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 glass rounded-3xl border border-border transition-colors">
        <div className="flex items-center space-x-6">
           <div className="flex items-center bg-foreground/5 dark:bg-white/5 border border-border rounded-2xl px-6 py-3 w-80 transition-colors">
              <Search className="w-4 h-4 text-foreground/20 dark:text-white/20 mr-3" />
              <input 
                type="text" 
                placeholder="Filter by name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-xs text-foreground dark:text-white focus:outline-none w-full transition-colors" 
              />
           </div>
           <button className="flex items-center space-x-3 text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
           </button>
        </div>
        <div className="flex items-center space-x-4">
           <span className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">
             Displaying {filteredPlayers.length} of {players.length} players
           </span>
        </div>
      </div>

      {/* Registry Table */}
      <LiquidGlassCard className="p-0 overflow-hidden">
         <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border bg-foreground/[0.02] dark:bg-white/[0.02] transition-colors">
                     <th className="px-8 py-6 text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">Player Profile</th>
                     <th className="px-8 py-6 text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">Registry ID</th>
                     <th className="px-8 py-6 text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">Squad / Position</th>
                     <th className="px-8 py-6 text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">Performance</th>
                     <th className="px-8 py-6 text-[10px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">Status</th>
                     <th className="px-8 py-6"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border transition-colors">
                   {filteredPlayers.length === 0 && !loading && (
                     <tr>
                       <td colSpan={6} className="px-8 py-12 text-center text-foreground/40 dark:text-white/40 text-sm font-bold uppercase tracking-wider">
                         No players found.
                       </td>
                     </tr>
                   )}
                   {loading && (
                     <tr>
                       <td colSpan={6} className="px-8 py-12 text-center text-foreground/40 dark:text-white/40 text-sm">
                         <div className="flex items-center justify-center space-x-2">
                           <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                           <span>Loading registry data...</span>
                         </div>
                       </td>
                     </tr>
                   )}
                   {filteredPlayers.map((player) => (
                      <tr key={player.id} className="hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 rounded-full overflow-hidden border border-border relative transition-colors bg-foreground/5 dark:bg-white/5">
                                  <Image src={player.image} alt={player.name} fill className="object-cover" />
                               </div>
                               <span className="text-sm font-bold text-foreground dark:text-white tracking-tight transition-colors">{player.name}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-xs font-mono text-foreground/40 dark:text-white/40 transition-colors">{player.id}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-1">
                               <p className="text-xs text-foreground dark:text-white font-bold transition-colors">{player.squad}</p>
                               <p className="text-[10px] text-foreground/40 dark:text-white/40 uppercase font-black tracking-widest transition-colors">{player.position}</p>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                               <div className="flex-1 h-1 w-24 bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                                  <div className="h-full bg-secondary" style={{ width: `${player.performance}%` }} />
                               </div>
                               <span className="text-xs font-black text-foreground dark:text-white transition-colors">{player.performance}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${
                              player.status === 'Active' ? 'bg-primary/10 text-primary border-primary/20 animate-pulse' :
                              player.status === 'Injured' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                              'bg-foreground/10 dark:bg-white/10 text-foreground/40 dark:text-white/40 border-border'
                            }`}>
                              {player.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                             <button 
                               onClick={() => {
                                 setEditingPlayer(player);
                                 setImagePreview(player.image);
                                 setImageBase64('');
                                 setShowEditModal(true);
                               }}
                               className="p-2 rounded-lg hover:bg-foreground/10 dark:hover:bg-white/10 text-foreground/20 dark:text-white/20 hover:text-foreground dark:hover:text-white transition-all cursor-pointer mr-2"
                               title="Edit Player"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                            <button 
                              onClick={() => handleDeletePlayer(player)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-foreground/20 dark:text-white/20 hover:text-destructive transition-all cursor-pointer"
                              title="Delete Player"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
               </tbody>
            </table>
         </div>
         <div className="p-8 bg-foreground/[0.01] dark:bg-white/[0.01] flex items-center justify-between border-t border-border transition-colors">
            <p className="text-[10px] text-foreground/20 dark:text-white/20 font-bold uppercase tracking-widest transition-colors">Showing {filteredPlayers.length} players</p>
            <div className="flex items-center space-x-4">
               <button className="px-6 py-2 glass text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer">Previous</button>
               <button className="px-6 py-2 glass text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer">Next</button>
            </div>
         </div>
      </LiquidGlassCard>

      {/* Edit Player Modal */}
      {showEditModal && editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md p-8 glass border border-border rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">Edit Player Profile</h2>
            <form onSubmit={handleEditPlayerSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors"
                  placeholder="e.g. David Maina"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest block">Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-foreground/60 dark:text-white/60 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-foreground/10 file:text-foreground dark:file:bg-white/10 dark:file:text-white hover:file:bg-foreground/20 cursor-pointer"
                />
                {(imagePreview || editingPlayer.image) && (
                  <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-border relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview || editingPlayer.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Squad</label>
                <select 
                  value={editingPlayer.squad}
                  onChange={(e) => setEditingPlayer({...editingPlayer, squad: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="U13 Foundation" className="bg-background">U13 Foundation</option>
                  <option value="U15 Academy" className="bg-background">U15 Academy</option>
                  <option value="U17 Academy" className="bg-background">U17 Academy</option>
                  <option value="Elite U18" className="bg-background">Elite U18</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Position</label>
                <select 
                  value={editingPlayer.position}
                  onChange={(e) => setEditingPlayer({...editingPlayer, position: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="Forward" className="bg-background">Forward</option>
                  <option value="Midfielder" className="bg-background">Midfielder</option>
                  <option value="Defender" className="bg-background">Defender</option>
                  <option value="Goalkeeper" className="bg-background">Goalkeeper</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest">Status</label>
                <select 
                  value={editingPlayer.status}
                  onChange={(e) => setEditingPlayer({...editingPlayer, status: e.target.value})}
                  className="w-full p-4 bg-foreground/5 dark:bg-white/5 border border-border rounded-xl text-foreground dark:text-white focus:border-secondary outline-none transition-colors appearance-none"
                >
                  <option value="Active" className="bg-background">Active</option>
                  <option value="Injured" className="bg-background">Injured</option>
                  <option value="Inactive" className="bg-background">Inactive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest block">Performance ({editingPlayer.performance}%)</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={editingPlayer.performance}
                  onChange={(e) => setEditingPlayer({...editingPlayer, performance: parseInt(e.target.value)})}
                  className="w-full h-1 bg-foreground/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPlayer(null);
                    setImageBase64('');
                    setImagePreview('');
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
