"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "./ui/text-reveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const images = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop",
  "/IMG_0471.jpg",
  "/IMG_0322.jpg",
  "/IMG_0301.jpg",
  "/IMG_5237.jpg"
];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      {/* Background Cinematic Image/Overlay Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence>
          <motion.div 
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ 
              backgroundImage: `url('${images[currentImageIndex]}')`,
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
        {/* Dynamic Overlay based on theme */}
        <div className="absolute inset-0 bg-background/25 dark:bg-black/70 transition-colors duration-500 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background transition-colors duration-500 z-10 pointer-events-none" />
        
        {/* Dynamic Light Streaks */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full animate-pulse z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full animate-pulse delay-700 z-10" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-20 w-full flex items-center justify-center">
        {/* Centered Content */}
        <div className="flex flex-col space-y-8 items-center text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-fit bg-foreground/5 border border-foreground/10 px-6 py-2 rounded-full backdrop-blur-md"
          >
            <span className="text-xs font-bold tracking-widest text-foreground/80 dark:text-white/80 uppercase">
              Kenya&apos;s Premier Football Development Academy
            </span>
          </motion.div>

          <div className="space-y-4">
            <TextReveal 
              text="Where Young Talent Becomes Elite Performance."
              className="text-5xl md:text-7xl font-heading font-black leading-[1.1] text-foreground dark:text-white tracking-tighter"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-foreground/60 dark:text-white/60 max-w-xl leading-relaxed mx-auto"
            >
              Professional football training academy focused on discipline, performance, 
              tactical intelligence and player development in the heart of Tatu City.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link 
              href="/pricing"
              className="group px-8 py-4 bg-secondary text-white font-bold rounded-full flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-secondary/20"
            >
              <span>JOIN ACADEMY</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/programs"
              className="px-8 py-4 bg-foreground/5 text-foreground dark:bg-white/10 dark:text-white font-bold rounded-full transition-all hover:bg-foreground/10 dark:hover:bg-white/20 border border-foreground/10 dark:border-white/20 active:scale-95 backdrop-blur-md"
            >
              EXPLORE PROGRAMS
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
