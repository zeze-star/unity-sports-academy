"use client";

import React from "react";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Shield, Globe, Zap, Users, Heart, Quote, Eye } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen transition-colors duration-500">
      {/* Cinematic Hero Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1526232759583-26f1b20d7331?q=80&w=2000&auto=format&fit=crop')",
              filter: "brightness(0.2)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background dark:to-black transition-colors duration-500" />
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <span className="text-secondary font-bold tracking-[0.4em] uppercase text-xs">Our Legacy</span>
          <h1 className="text-6xl md:text-8xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">
            THE UNITY <span className="text-foreground/25 dark:text-white/20">STORY.</span>
          </h1>
        </div>
      </section>

      {/* Vision & Values - Overhauled Design (Moved Up) */}
      <section className="bg-background section-padding transition-colors duration-500 relative overflow-hidden">
        {/* Dynamic ambient background glow */}
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Purpose & Principles</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">What Drives Us.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
            {/* Vision Column */}
            <div className="lg:col-span-2 flex flex-col h-full">
              <LiquidGlassCard className="p-12 space-y-8 flex flex-col justify-center h-full bg-gradient-to-br from-card to-background border-secondary/20 relative group overflow-hidden">
                {/* Large decorative Quote Icon */}
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <Quote className="w-64 h-64 text-secondary" />
                </div>
                
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-secondary animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-heading font-black text-secondary tracking-widest uppercase">Our Vision</h3>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-heading font-black text-foreground dark:text-white leading-snug tracking-tight italic transition-colors">
                  &ldquo;To nurture football talent from grassroots to professional levels while positively impacting our community.&rdquo;
                </h3>
                
                <div className="w-12 h-1 bg-secondary rounded-full" />
              </LiquidGlassCard>
            </div>

            {/* Values Column */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
              {[
                { icon: Zap, title: "Youth Development", desc: "Instilling professional foundations, technical agility, and spatial game awareness early." },
                { icon: Users, title: "Inclusivity (All Genders)", desc: "Providing equal elite training pathways and competitive exposure for male and female athletes." },
                { icon: Shield, title: "Professionalism and Discipline", desc: "Setting high behavioral, athletic, and academic benchmarks to groom future leaders." },
                { icon: Heart, title: "Community Engagement", desc: "Enriching families and grassroots organizations through local clinics, outreach, and events." },
                { icon: Globe, title: "Long-term Sustainability", desc: "Securing stable infrastructure and corporate/international partnerships for player careers." }
              ].map((val, idx) => (
                <div 
                  key={val.title} 
                  className="flex items-start space-x-6 p-6 rounded-3xl border border-border bg-foreground/[0.01] dark:bg-white/[0.01] hover:bg-foreground/[0.03] dark:hover:bg-white/[0.03] hover:border-secondary/20 transition-all duration-300 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-border group-hover:bg-secondary/10 group-hover:border-secondary/20 flex items-center justify-center transition-colors shrink-0">
                    <val.icon className="w-5 h-5 text-foreground/40 dark:text-white/40 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest">0{idx + 1}</span>
                      <h4 className="text-lg font-bold text-foreground dark:text-white transition-colors">{val.title}</h4>
                    </div>
                    <p className="text-xs text-foreground/40 dark:text-white/40 leading-relaxed transition-colors">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaching & Admin Staff - Luxury Editorial */}
      <section className="bg-background section-padding transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Elite Staff</span>
              <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground dark:text-white leading-tight tracking-tighter transition-colors">
                Masters Of <br />
                <span className="text-foreground/40 dark:text-white/40">The Craft.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Steve Mukolwe", role: "Chairman", bio: "Leading the academy's vision and strategic growth.", image: "/new images/Steve Mukolwe.jpeg", zoomIn: true },
              { name: "Vicko Okello", role: "Team Manager", bio: "Overseeing day-to-day team operations and logistics.", image: "/new images/Vicko Okello.jpg", zoomIn: false },
              { name: "James Mburu", role: "Head Coach", bio: "FKF certified, driving tactical excellence and player development.", image: "/new images/James Mburu.jpeg", zoomIn: false },
              { name: "Nephat Wainaina", role: "Assistant Coach", bio: "Specializing in technical drills and youth progression.", image: "/new images/Nephat Wanaina.jpeg", zoomIn: true },
              { name: "Anita Lucy", role: "Media Personality", bio: "Directing public relations, brand voice, and media content.", image: "/new images/Anita Lucy.jpeg" },
              { name: "Kevin Waiga", role: "Assistant Coach", bio: "Focusing on physical conditioning and positional play.", image: "/Kevin Waiga.jpeg", zoomIn: false },
              { name: "Violet Odingo", role: "Treasurer/Secretary", bio: "Managing academy administration and financial health.", image: "/Violet .jpeg" }
            ].map((coach) => (
              <LiquidGlassCard key={coach.name} className="p-0 group overflow-hidden">
                <motion.div
                  className="aspect-[3/4] relative overflow-hidden"
                  whileInView={{ scale: coach.zoomIn === false ? 0.92 : 1.08 }}
                  whileHover={{ scale: coach.zoomIn === false ? 0.88 : 1.12 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                   <Image src={coach.image} alt={coach.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-transparent to-transparent transition-all duration-500" />
                </motion.div>
                <div className="p-8 space-y-2 relative">
                   <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight transition-colors">{coach.name}</h3>
                   <p className="text-secondary text-[10px] font-black uppercase tracking-widest">{coach.role}</p>
                   <p className="text-xs text-foreground/60 dark:text-white/60 leading-relaxed pt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                     {coach.bio}
                   </p>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Showcase - Updated with 6 pictures */}
      <section className="bg-foreground/5 dark:bg-white/5 section-padding transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Our Arena</span>
             <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">Elite Facilities.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               {
                 title: "Advanced Performance Pitches",
                 desc: "Our facility features the latest generation hybrid turf, meeting FIFA professional standards for both training and competitive matches.",
                 image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
                 label: "The Main Arena"
               },
               {
                 title: "Gym Facility",
                 desc: "A state-of-the-art strength and conditioning center designed to optimize player performance and physical durability.",
                 image: "/20260302_185229.jpg",
                 label: "Gym Facility"
               },
               {
                 title: "Training Pitch B",
                 desc: "Additional high-quality natural grass pitch dedicated to tactical drills, youth matches, and goalie training sessions.",
                 image: "/Football pitch-2.jpg",
                 label: "Secondary Pitch"
               },
               {
                 title: "Recovery Lounges",
                 desc: "A premium space for video analysis, group meetings, study, and player relaxation between rigorous training routines.",
                 image: "/logged.jpg",
                 label: "Team Room"
               },
               {
                 title: "Outdoor Swimming Pool",
                 desc: "Dedicated recovery pool for hydrotherapy, cool-downs, and endurance training under professional supervision.",
                 image: "/Copy of Swimming pool.jpeg",
                 label: "Recovery Zone"
               },
               {
                 title: "Cardio Grounds",
                 desc: "Comprehensive cardio training grounds optimized for soccer drills, speed exercises, and academy player telemetry gathering.",
                 image: "/20260302_191247.jpg",
                 label: "Development Hub"
               }
             ].map((facility) => (
                <div key={facility.title} className="space-y-6">
                   <div className="aspect-video relative rounded-[40px] overflow-hidden border border-border transition-colors">
                      <Image src={facility.image} alt={facility.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                         <span className="text-white font-bold tracking-widest uppercase text-xs">{facility.label}</span>
                      </div>
                   </div>
                   <div className="space-y-4 px-4">
                      <h3 className="text-2xl font-bold text-foreground dark:text-white transition-colors">{facility.title}</h3>
                      <p className="text-foreground/60 dark:text-white/60 leading-relaxed text-sm transition-colors">
                         {facility.desc}
                      </p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Vision (Moved Down) */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground dark:text-white leading-tight tracking-tighter transition-colors">
              A Vision For <br />
              <span className="text-foreground/40 dark:text-white/40">Kenyan Football.</span>
            </h2>
            <div className="space-y-6 text-lg text-foreground/60 dark:text-white/60 leading-relaxed transition-colors">
              <p>
                Founded in the heart of Tatu City, Unity Sports Academy was born from a singular vision: 
                to bridge the gap between local talent and global professional standards.
              </p>
              <p>
                We believe that every young player in Kenya deserves access to the same tactical, 
                physical, and mental development found in the world&apos;s elite football institutions.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="aspect-square relative rounded-3xl overflow-hidden border border-border transition-colors w-full">
              <Image src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600&auto=format&fit=crop" alt="Training" fill className="object-cover" />
            </div>
            <div className="aspect-square relative rounded-3xl overflow-hidden border border-border transition-colors w-full">
              <Image src="/KSA CHAMPIONS PRE-SEASON 25.png" alt="Academy Life" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
