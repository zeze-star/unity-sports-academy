"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowColor?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function LiquidGlassCard({
  children,
  className,
  containerClassName,
  glowColor = "rgba(200, 169, 107, 0.2)",
  onClick,
}: LiquidGlassCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
    
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      onMouseEnter={() => {}}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative rounded-2xl transition-all duration-500",
        containerClassName
      )}
    >
      {/* Background Liquid Gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-80" 
        style={{ background: "linear-gradient(135deg, var(--glass-shine), transparent, var(--glass-shine))" }}
      />
      
      {/* Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${glowX}px ${glowY}px, ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Glass Surface */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-2xl border transition-all duration-500 backdrop-blur-md",
          "border-[var(--glass-border)] bg-[var(--glass-bg)]",
          "group-hover:border-primary/20 group-hover:bg-background/80",
          className
        )}
      >
        {children}
        
        {/* Shine highlight */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
          style={{ background: "linear-gradient(45deg, transparent, var(--glass-shine), transparent)" }}
        />
      </div>
    </motion.div>
  );
}
