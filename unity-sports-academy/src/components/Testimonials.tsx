"use client";

import React from "react";
import { motion } from "framer-motion";
import { LiquidGlassCard } from "./ui/liquid-glass-card";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "David Olandez",
    role: "Elite U17 Player",
    content: "The level of tactical training here is unlike anything else in Kenya. I feel prepared for the professional stage.",
    image: "/new images/davidolandez.jpg"
  },
  {
    name: "Sarah Wanjiku",
    role: "Parent",
    content: "Unity focuses as much on character and discipline as they do on football. My son has grown tremendously.",
    image: "/new images/sarah wanjiku.jpg"
  }
];

export function Testimonials() {
  return (
    <section className="bg-background section-padding relative overflow-hidden transition-colors duration-500">
       {/* Background Cinematic Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background dark:from-black via-transparent to-background dark:to-black" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px]">Testimonials</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">
            Voices of Our <br />
            <span className="text-foreground/40 dark:text-white/40">Academy Community.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <LiquidGlassCard className="p-12 space-y-8 flex flex-col items-center text-center group">
                <div className="relative">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/30">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border border-background dark:border-unity-black">
                    <Quote className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xl md:text-2xl text-foreground dark:text-white font-medium italic leading-relaxed transition-colors">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="pt-4">
                    <h4 className="text-foreground dark:text-white font-bold transition-colors">{t.name}</h4>
                    <p className="text-secondary text-xs font-bold uppercase tracking-widest mt-1">
                      {t.role}
                    </p>
                  </div>
                </div>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
