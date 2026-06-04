"use client";

import React from "react";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "./ui/liquid-glass-card";
import { GraduationCap, Microscope, ShieldCheck, Zap, Globe, Trophy } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "FKF Structured Coaching",
    desc: "Elite curriculum designed by FKF-certified professionals for optimal growth."
  },
  {
    icon: Microscope,
    title: "Sports Science Integration",
    desc: "Data-driven performance tracking and recovery optimization."
  },
  {
    icon: ShieldCheck,
    title: "Safe & Professional Environment",
    desc: "Top-tier facilities at Tatu City with maximum focus on player welfare."
  },
  {
    icon: Zap,
    title: "Tactical Intelligence",
    desc: "Developing high-IQ players who read the game and adapt in real-time."
  },
  {
    icon: Globe,
    title: "Global Pathways",
    desc: "Exclusive scouting networks and partnerships with international clubs."
  },
  {
    icon: Trophy,
    title: "Scholarship Programs",
    desc: "Merit-based financial support for exceptionally talented individuals."
  }
];

export function WhyChooseUs() {
  return (
    <section className="bg-background section-padding relative transition-colors duration-500">
       {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] bg-secondary/10 border border-secondary/20 px-4 py-1.5 rounded-full">
              The Unity Edge
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tighter">
            Why Elite Athletes <br />
            <span className="text-foreground/40 dark:text-white/40">Choose Unity.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <LiquidGlassCard className="p-10 space-y-6 h-full flex flex-col items-start text-left">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/40 dark:text-white/40 text-sm leading-relaxed transition-colors">
                    {feature.desc}
                  </p>
                </div>
                
                {/* Micro-interaction highlight */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_#E63946]" />
                </div>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
