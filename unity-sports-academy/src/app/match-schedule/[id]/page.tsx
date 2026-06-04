"use client";

import React from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { 
  Trophy, 
  ArrowLeft, 
  Shield, 
  Activity,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function DynamicMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

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
                          <span className="text-7xl font-heading font-black text-white">{id === '0' ? '2' : '0'}</span>
                          <span className="text-4xl font-black text-white/10">:</span>
                          <span className="text-7xl font-heading font-black text-white">{id === '0' ? '1' : '0'}</span>
                       </div>
                       <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Match Session #{id}</p>
                    </div>
                 </div>

                 {/* Team B */}
                 <div className="p-12 text-center md:text-left space-y-6">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                       <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                          <span className="text-2xl font-black text-white/20">OPP</span>
                       </div>
                       <h2 className="text-3xl font-black text-white tracking-tighter">Opponent Team</h2>
                       <div className="flex items-center space-x-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                          <Activity className="w-3 h-3" />
                          <span>Away Side</span>
                       </div>
                    </div>
                 </div>
              </div>
           </LiquidGlassCard>
        </div>

        <div className="text-center p-20 glass rounded-[40px] border border-white/5">
           <Trophy className="w-12 h-12 text-unity-gold mx-auto mb-6" />
           <h3 className="text-3xl font-black text-white tracking-tighter">Match Analytics Coming Soon.</h3>
           <p className="text-white/40 max-w-md mx-auto mt-4">We are currently processing the biometric and tactical data for this match session. Check back in a few hours.</p>
        </div>
      </div>
    </div>
  );
}
