"use client";

import React from "react";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "./ui/liquid-glass-card";
import { Trophy, Target, Star, Shield } from "lucide-react";
import Image from "next/image";

const achievements = [
  { icon: Trophy, title: "Elite Excellence", desc: "Highest player placement rate in Nairobi." },
  { icon: Target, title: "Tactical Depth", desc: "FKF-inspired curriculum & training." },
];

export function AboutPreview() {
  return (
    <section className="bg-background section-padding relative overflow-hidden transition-colors duration-500">
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-unity-green-emerald/5 dark:bg-unity-green-emerald/10 blur-[100px] rounded-full" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content - Editorial Storytelling */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3"
          >
            <div className="h-px w-12 bg-secondary" />
            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Our Philosophy</span>
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-tight tracking-tighter">
              Developing Champions <br /> 
              <span className="text-foreground/40 dark:text-white/40">Beyond The Pitch.</span>
            </h2>
            <p className="text-lg text-foreground/60 dark:text-white/60 leading-relaxed max-w-xl">
              Unity Sports Academy isn&apos;t just a training ground; it&apos;s a symphony of success. 
              We combine world-class sports science with elite tactical development to 
              shape Kenya&apos;s next generation of football legends.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {achievements.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-unity-green-emerald/10 dark:bg-unity-green-emerald/20 flex items-center justify-center border border-unity-green-emerald/20 dark:border-unity-green-emerald/30">
                  <item.icon className="w-5 h-5 text-unity-green-emerald" />
                </div>
                <h4 className="text-foreground dark:text-white font-bold">{item.title}</h4>
                <p className="text-sm text-foreground/40 dark:text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group flex items-center space-x-4 text-unity-gold font-bold tracking-widest text-xs uppercase pt-6"
          >
            <span>Learn our full story</span>
            <div className="w-8 h-8 rounded-full border border-unity-gold/30 flex items-center justify-center transition-all group-hover:bg-unity-gold group-hover:text-background dark:group-hover:text-unity-black">
              <Star className="w-3 h-3" />
            </div>
          </motion.button>
        </div>

        {/* Right Content - Visual Composition */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-3xl overflow-hidden border border-foreground/5 dark:border-white/5 shadow-2xl"
          >
            <div className="aspect-[4/5] relative">
               <Image 
                src="/Champions 2024_2025.jpg" 
                alt="Academy training" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 dark:from-black/80 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Achievement Card Float */}
          <div className="absolute -bottom-10 -left-10 w-64 hidden md:block">
            <LiquidGlassCard className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-unity-gold flex items-center justify-center">
                   <Shield className="w-5 h-5 text-background dark:text-unity-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-foreground dark:text-white leading-none">5+</span>
                  <span className="text-[10px] text-foreground/40 dark:text-white/40 uppercase font-bold tracking-widest">Coaches</span>
                </div>
              </div>
              <p className="text-[10px] text-foreground/60 dark:text-white/60 leading-relaxed font-medium">
                Our staff includes FKF and CAF certified professionals.
              </p>
            </LiquidGlassCard>
          </div>
          
          {/* Decorative Square Grid */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] dark:bg-[radial-gradient(white_1px,transparent_1px)] opacity-[0.05] dark:opacity-[0.1] [background-size:20px_20px] -z-10" />
        </div>
      </div>
    </section>
  );
}
