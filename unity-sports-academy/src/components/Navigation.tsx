"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

const navLinks = [
  { name: "Homepage", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Programs",
    href: "/programs",
    subLinks: [
      { name: "All Programs", href: "/programs" },
      { name: "Match Schedule", href: "/match-schedule" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "News", href: "/news" },
  { name: "Contact Us", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl py-3 border-b border-border shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-16 h-16 md:w-20 md:h-20 transition-transform group-hover:scale-105">
             <Image 
               src="/LOGO_V1-removebg-preview.png" 
               alt="Unity Sports Academy Logo" 
               fill
               className="object-contain"
               priority
             />
          </div>
          <div className="flex flex-col justify-center">
             <div className="flex items-baseline justify-between w-full">
               <span className={cn(
                 "text-xl font-heading font-black tracking-tighter transition-colors leading-none",
                 scrolled ? "text-foreground" : "text-foreground dark:text-white"
               )}>
                 UNITY
               </span>
               <span className={cn(
                 "text-xl font-heading font-black tracking-tighter transition-colors leading-none ml-1",
                 "text-unity-gold"
               )}>
                 SPORTS
               </span>
             </div>
             <div className={cn(
               "flex justify-between w-full text-[0.62rem] font-heading font-black transition-colors leading-none mt-1",
               scrolled ? "text-foreground/80" : "text-foreground/80 dark:text-white/80"
             )}>
               <span>A</span><span>C</span><span>A</span><span>D</span><span>E</span><span>M</span><span>Y</span>
             </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => setActiveSubmenu(link.name)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center space-x-1",
                  scrolled 
                    ? "text-foreground/80 hover:text-foreground" 
                    : "text-foreground/80 dark:text-white/80 hover:text-foreground dark:hover:text-white"
                )}
              >
                <span>{link.name}</span>
                {link.subLinks && <ChevronDown className="w-4 h-4 opacity-50" />}
              </Link>
              
              {link.subLinks && (
                <AnimatePresence>
                  {activeSubmenu === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl p-2 shadow-2xl backdrop-blur-xl"
                    >
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
          
          <div className="flex items-center space-x-4 pl-4 border-l border-foreground/10">
            <ThemeToggle />
            <Link
              href="/pricing"
              className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-white text-sm font-bold rounded-full transition-all border border-white/20 hover:scale-105 active:scale-95"
            >
              JOIN ACADEMY
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button
            className={cn(
              "transition-colors",
              scrolled ? "text-foreground" : "text-foreground dark:text-white"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border mt-4 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name} className="space-y-2">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-lg font-bold text-foreground"
                  >
                    {link.name}
                  </Link>
                  {link.subLinks && (
                    <div className="pl-4 space-y-2 border-l border-secondary/20 ml-1">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-foreground/60 hover:text-secondary transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3">
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-secondary text-white text-center font-bold rounded-xl shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform"
                >
                  JOIN ACADEMY
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
