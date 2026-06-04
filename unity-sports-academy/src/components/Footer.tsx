"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaXTwitter, FaFacebookF, FaYoutube } from "react-icons/fa6";
import Image from "next/image";

const socialLinks = [
  { icon: FaInstagram, href: "#" },
  { icon: FaXTwitter, href: "#" },
  { icon: FaFacebookF, href: "#" },
  { icon: FaYoutube, href: "#" },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-background border-t border-border pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-0 w-full h-96 bg-secondary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-12 h-12">
                <Image 
                  src="/LOGO_V1-removebg-preview.png" 
                  alt="Unity Sports Academy Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="text-xl font-heading font-bold tracking-tighter text-foreground">
                UNITY <span className="text-secondary">SPORTS</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Developing Kenya&apos;s next generation of football legends through 
              world-class training and professional pathways at Tatu City.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, i) => (
                <Link key={i} href={social.href} className="w-10 h-10 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition-all">
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-foreground font-bold text-xs uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "Homepage", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Programs", href: "/programs" },
                { name: "Match Schedule", href: "/match-schedule" },
                { name: "Pricing", href: "/pricing" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-foreground font-bold text-xs uppercase tracking-[0.2em]">Academy Info</h4>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: "Tatu City, Nairobi, Kenya" },
                { icon: Phone, text: "+254 707 857 161" },
                { icon: Mail, text: "info@unitysports-academy.com" }
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-muted-foreground text-sm">
                  <item.icon className="w-4 h-4 text-secondary mt-1 shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-foreground font-bold text-xs uppercase tracking-[0.2em]">Newsletter</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Subscribe for academy updates and tournament news.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-foreground/5 border border-border rounded-full px-6 py-4 text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-secondary/20">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Unity Sports Academy. All rights reserved.
          </p>
           <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            © Designed and Developed by Smartech.0708511583.
            <Link href="/admin" className="opacity-20 hover:opacity-100 hover:text-secondary transition-opacity p-1.5 rounded flex items-center justify-center cursor-pointer" title="Admin Portal">
              <span className="w-1.5 h-1.5 bg-current rounded-full" />
            </Link>
          </p>
          <div className="flex items-center space-x-8 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
