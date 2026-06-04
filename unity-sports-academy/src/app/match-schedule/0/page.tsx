"use client";

import React from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Activity, 
  Shield, 
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function MatchDetailPage() {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-unity-gold/10 blur-[150px] rounded-full" />
         <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-unity-green-emerald/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
        <Link href="/match-schedule" className="inline-flex items-center space-x-2 text-white/40 hover:text-white transition-all group">
           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
           <span className="text-[10px] font-black uppercase tracking-widest">Competition Center</span>
        </Link>

        {/* Scoreboard Header - "Broadcast UI" */}
        <div className="relative">
           <LiquidGlassCard className="p-0 overflow-hidden border-white/5 bg-black/40">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                 {/* Team A */}
                 <div className="p-12 text-center md:text-right space-y-6">
                    <div className="flex flex-col items-center md:items-end space-y-4">
                       <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                          <span className="text-2xl font-black text-unity-gold">USA</span>
                       </div>
                       <h2 className="text-3xl font-black text-white tracking-tighter">Unity Academy</h2>
                       <div className="flex items-center space-x-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                          <Shield className="w-3 h-3" />
                          <span>Home Squad</span>
                       </div>
                    </div>
                 </div>

                 {/* Score / Status */}
                 <div className="p-12 bg-white/[0.02] border-x border-white/5 h-full flex flex-col items-center justify-center space-y-8">
                    <div className="space-y-2 text-center">
                       <span className="text-unity-gold font-black text-[10px] uppercase tracking-[0.4em]">Final Result</span>
                       <div className="flex items-center justify-center space-x-8">
                          <span className="text-7xl font-heading font-black text-white">2</span>
                          <span className="text-4xl font-black text-white/10">:</span>
                          <span className="text-7xl font-heading font-black text-white">1</span>
                       </div>
                       <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Nairobi Regional League</p>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="flex items-center space-x-4">
                       <div className="flex flex-col items-center">
                          <span className="text-white font-black text-xs">24&apos;</span>
                          <span className="text-[8px] text-white/40 font-bold uppercase">Maina</span>
                       </div>
                       <div className="flex flex-col items-center">
                          <span className="text-white font-black text-xs">78&apos;</span>
                          <span className="text-[8px] text-white/40 font-bold uppercase">Omolo</span>
                       </div>
                    </div>
                 </div>

                 {/* Team B */}
                 <div className="p-12 text-center md:text-left space-y-6">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                       <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                          <span className="text-2xl font-black text-white/20">GMY</span>
                       </div>
                       <h2 className="text-3xl font-black text-white tracking-tighter">Gor Mahia Youth</h2>
                       <div className="flex items-center space-x-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                          <Activity className="w-3 h-3" />
                          <span>Away Side</span>
                       </div>
                    </div>
                 </div>
              </div>
           </LiquidGlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Live Telemetry / Match Stats */}
           <div className="lg:col-span-2 space-y-10">
              <div className="space-y-6">
                 <h3 className="text-white font-bold tracking-tight uppercase text-xs px-4">Performance Telemetry</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: Zap, label: "Efficiency", value: "88%", delta: "+12%" },
                      { icon: Target, label: "Possession", value: "62%", delta: "-4%" },
                      { icon: Activity, label: "Intensity", value: "High", delta: "Elite" }
                    ].map((stat) => (
                      <LiquidGlassCard key={stat.label} className="p-8 space-y-4">
                         <stat.icon className="w-5 h-5 text-unity-gold" />
                         <div className="space-y-1">
                            <p className="text-4xl font-heading font-black text-white">{stat.value}</p>
                            <div className="flex items-center justify-between">
                               <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{stat.label}</p>
                               <span className="text-[8px] text-unity-green-emerald font-black">{stat.delta}</span>
                            </div>
                         </div>
                      </LiquidGlassCard>
                    ))}
                 </div>
              </div>

              {/* Match Timeline */}
              <div className="space-y-6">
                 <h3 className="text-white font-bold tracking-tight uppercase text-xs px-4">Match Timeline</h3>
                 <LiquidGlassCard className="p-10 space-y-12">
                    {[
                      { min: "24&apos;", event: "Goal!", player: "David Maina", desc: "Clinical finish after a fast transition from midfield." },
                      { min: "45&apos;", event: "Half Time", player: "Strategic Pause", desc: "Unity dominating possession (68%)." },
                      { min: "78&apos;", event: "Goal!", player: "Kelvin Omolo", desc: "Towering header from a set-piece delivery." },
                      { min: "85&apos;", event: "Yellow Card", player: "Samuel Wanjiru", desc: "Tactical foul to prevent counter-attack." }
                    ].map((step, i) => (
                      <div key={i} className="relative pl-12 group">
                         <div className="absolute left-0 top-0 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center z-10 group-hover:border-unity-gold transition-colors">
                            <span className="text-[10px] font-black text-white">{step.min}</span>
                         </div>
                         {i < 3 && <div className="absolute left-4 top-8 bottom-[-48px] w-px bg-white/10" />}
                         <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                               <h4 className="text-sm font-bold text-white uppercase tracking-widest">{step.event}</h4>
                               <span className="text-xs text-unity-gold font-bold">{step.player}</span>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                         </div>
                      </div>
                    ))}
                 </LiquidGlassCard>
              </div>
           </div>

           {/* Squad / Lineup Sidebar */}
           <div className="space-y-8">
              <div className="space-y-6">
                 <h3 className="text-white font-bold tracking-tight uppercase text-xs px-4">Starting XI</h3>
                 <LiquidGlassCard className="p-8 space-y-6">
                    {[
                      { pos: "GK", name: "K. Omolo", rating: "8.2" },
                      { pos: "DEF", name: "J. Mutua", rating: "7.8" },
                      { pos: "DEF", name: "A. Kiprotich", rating: "7.5" },
                      { pos: "MID", name: "S. Wanjiru", rating: "8.5" },
                      { pos: "FWD", name: "D. Maina", rating: "9.4" }
                    ].map((player) => (
                      <div key={player.name} className="flex items-center justify-between group">
                         <div className="flex items-center space-x-4">
                            <span className="text-[10px] font-black text-white/20 w-8">{player.pos}</span>
                            <span className="text-sm font-bold text-white group-hover:text-unity-gold transition-colors">{player.name}</span>
                         </div>
                         <span className="text-xs font-black text-white/40 group-hover:text-white">{player.rating}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-white/5">
                       <button className="w-full py-3 glass border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all">
                          View Full Squad Details
                       </button>
                    </div>
                 </LiquidGlassCard>
              </div>

              {/* Venue Info Card */}
              <LiquidGlassCard className="p-8 space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-unity-gold/5 blur-3xl rounded-full" />
                 <h3 className="text-white font-bold tracking-tight uppercase text-xs">Venue Details</h3>
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-start space-x-4">
                       <MapPin className="w-4 h-4 text-unity-gold mt-1" />
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-white">Tatu City Stadium</p>
                          <p className="text-xs text-white/40">Unity Arena • Pitch Alpha</p>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4">
                       <Clock className="w-4 h-4 text-unity-gold mt-1" />
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-white">Attendance</p>
                          <p className="text-xs text-white/40">1,240 Spectators</p>
                       </div>
                    </div>
                 </div>
              </LiquidGlassCard>
           </div>
        </div>
      </div>
    </div>
  );
}
