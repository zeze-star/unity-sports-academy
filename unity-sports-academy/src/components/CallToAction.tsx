"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="bg-background py-32 relative overflow-hidden transition-colors duration-500">
      {/* Stadium Lighting Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-secondary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="h-full w-full bg-card border border-border rounded-[40px] p-12 md:p-24 overflow-hidden relative shadow-2xl shadow-secondary/5">
          {/* Animated Background Element */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full animate-pulse" />
          
          <div className="max-w-3xl space-y-8 relative z-10">
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-secondary/20 border border-secondary/30 px-4 py-1 rounded-full"
            >
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-black tracking-widest text-secondary uppercase">Begin Your Journey</span>
            </motion.div>

            <h2 className="text-5xl md:text-8xl font-heading font-black text-foreground leading-none tracking-tighter">
              Ready To Build Your <br />
              <span className="text-secondary">Football Future?</span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              Join Kenya&apos;s most prestigious football academy. 
              Assessments are now open for the 2026/27 season.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Link 
                href="/contact"
                className="group px-10 py-5 bg-secondary text-white font-black rounded-full flex items-center space-x-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-secondary/20"
              >
                <span>BOOK ASSESSMENT</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/programs"
                className="px-10 py-5 bg-foreground/5 text-foreground font-black rounded-full transition-all hover:bg-foreground/10 border border-border active:scale-95"
              >
                VIEW PROGRAMS
              </Link>
            </div>
          </div>
          
          {/* Floating Football Image (Abstract) */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 20 }}
            whileInView={{ opacity: 0.2, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-full mix-blend-screen -z-10"
          />
        </div>
      </div>
    </section>
  );
}
