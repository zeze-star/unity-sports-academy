import React from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { ArrowUpRight, Clock, Users, Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const allPrograms = [
  {
    title: "Goalkeeper Excellence",
    age: "12 - 18+",
    duration: "Full Season",
    schedule: "3x Weekly",
    image: "/IMG_5237.jpg",
    desc: "Comprehensive training focused on shot-stopping, distribution, and penalty-box command."
  },
  {
    title: "Tactical Intelligence",
    age: "14 - 19",
    duration: "Full Season",
    schedule: "4x Weekly",
    image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop",
    desc: "Mastering formations, situational awareness, and advanced game reading strategies."
  },
  {
    title: "Youth Development",
    age: "6 - 13",
    duration: "Term Based",
    schedule: "2x Weekly",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
    desc: "Developing technical foundations and a love for the game in young athletes."
  },
  {
    title: "Elite Conditioning",
    age: "13 - 18+",
    duration: "Full Season",
    schedule: "Daily Sessions",
    image: "/20260302_190959.jpg",
    desc: "Physiological development, speed, explosive power, and injury prevention."
  },
  {
    title: "Precision Finishing",
    age: "12 - 18+",
    duration: "Specialized",
    schedule: "2x Weekly",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    desc: "Focused workshop on clinical finishing, striking technique, and movement in the final third."
  }
];

export default function ProgramsPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="space-y-4">
          <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Training Index</span>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">
            Development <br />
            <span className="text-foreground/40 dark:text-white/40">Pathways.</span>
          </h1>
        </div>

        {/* Player Pathway */}
        <div className="glass rounded-[40px] p-12 md:p-24 relative overflow-hidden transition-colors">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
           
           <div className="relative z-10 space-y-16">
              <div className="text-center space-y-4">
                 <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors uppercase">Player Development Pathway</h2>
                 <p className="text-foreground/60 dark:text-white/60 max-w-xl mx-auto text-sm transition-colors font-bold uppercase tracking-widest">From Young Talent to Pro Player — for both male and females</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative">
                 {[
                   { step: "01", title: "Foundation Skills", age: "U9-U11", detail: "Technical basics & passion." },
                   { step: "02", title: "Advanced Training", age: "U13-U17", detail: "Tactical awareness & position." },
                   { step: "03", title: "Elite Development", age: "U19-U21", detail: "Elite performance & scouting." },
                   { step: "04", title: "Professional Career", age: "21+", detail: "Transfer opportunities & pro contracts." }
                 ].map((path, idx) => (
                   <React.Fragment key={path.step}>
                     <div className="flex-1 w-full space-y-4 p-8 bg-white/60 dark:bg-white/5 border border-foreground/10 dark:border-white/10 backdrop-blur-md rounded-3xl text-center group hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm">
                        <span className="text-secondary font-black text-4xl opacity-40 group-hover:opacity-100 transition-opacity">{path.step}</span>
                        <div className="space-y-1">
                           <h4 className="text-foreground dark:text-white font-bold transition-colors uppercase">{path.title}</h4>
                           <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{path.age}</p>
                        </div>
                        <p className="text-xs text-foreground/70 dark:text-white/70 font-medium leading-relaxed transition-colors">{path.detail}</p>
                     </div>
                     {idx < 3 && (
                       <div className="flex items-center justify-center shrink-0 animate-pulse py-2 md:py-0">
                         <ChevronRight className="w-8 h-8 text-secondary transform rotate-90 md:rotate-0" />
                       </div>
                     )}
                   </React.Fragment>
                 ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                 <div className="p-6 bg-foreground/5 dark:bg-white/5 border border-border rounded-2xl text-center flex items-center justify-center">
                   <h4 className="text-foreground dark:text-white font-bold text-xs uppercase tracking-widest">Path to Success</h4>
                 </div>
                 <div className="p-6 bg-unity-gold/10 border border-unity-gold/20 rounded-2xl text-center flex items-center justify-center">
                   <h4 className="text-unity-gold font-bold text-xs uppercase tracking-widest">Ladies Team Inclusion</h4>
                 </div>
                 <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-2xl text-center flex items-center justify-center">
                   <h4 className="text-secondary font-bold text-xs uppercase tracking-widest">Coaching & Mentorship</h4>
                 </div>
                 <div className="p-6 bg-secondary text-white rounded-2xl text-center shadow-xl flex flex-col items-center justify-center group relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                   <h4 className="font-black text-sm uppercase tracking-widest leading-tight relative z-10">Scholarship Guidance</h4>
                   <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1 relative z-10">USA & European Colleges</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPrograms.map((program) => (
            <LiquidGlassCard key={program.title} className="p-0 flex flex-col h-full group">
              <div className="relative aspect-video overflow-hidden">
                <Image src={program.image} alt={program.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black/80 to-transparent transition-all duration-500" />
              </div>
              
              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground dark:text-white group-hover:text-secondary transition-colors">{program.title}</h3>
                  <p className="text-sm text-foreground/40 dark:text-white/40 leading-relaxed transition-colors">{program.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border transition-colors">
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest transition-colors">
                    <Users className="w-3 h-3 text-secondary" />
                    <span>{program.age}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest transition-colors">
                    <Clock className="w-3 h-3 text-secondary" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-foreground/60 dark:text-white/60 uppercase tracking-widest transition-colors">
                    <Calendar className="w-3 h-3 text-secondary" />
                    <span>{program.schedule}</span>
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <Link 
                    href="/pricing"
                    className="w-full py-4 bg-secondary text-white font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all rounded-xl flex items-center justify-center space-x-2 group/btn shadow-lg shadow-secondary/20 border border-secondary/50 text-center"
                  >
                    <span>Enroll Now</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
