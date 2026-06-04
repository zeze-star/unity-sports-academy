"use client";

import React, { useEffect, useState, Suspense } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ContactForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const [inquiryType, setInquiryType] = useState("Enrollment Inquiry");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (planParam) {
      const type = planParam === "Corporate Partnership" ? "Partnership Opportunity" : "Enrollment Inquiry";
      let msg = "";
      if (planParam === "Corporate Partnership") {
        msg = `Hello Unity Sports Academy,\n\nI am interested in exploring a Corporate Partnership opportunity with your academy. Please share more details about how we can collaborate.\n\nThank you.`;
      } else if (planParam === "Scholarship") {
        msg = `Hello Unity Sports Academy,\n\nI would like to apply for the Unity Scholarship Program. I believe I/my child qualifies for a merit-based assessment. Please provide more information on the next steps.\n\nThank you.`;
      } else {
        msg = `Hello Unity Sports Academy,\n\nI am interested in enrolling in the "${planParam}" program. Please provide me with more details about the enrollment process, schedules, and requirements.\n\nThank you.`;
      }

      const timer = setTimeout(() => {
        setInquiryType(type);
        setMessage(msg);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [planParam]);

  return (
    <LiquidGlassCard className="p-12 space-y-10">
       <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground dark:text-white tracking-tight transition-colors">Send a Message</h3>
          <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">We typically respond within 24 hours.</p>
       </div>

       <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest ml-1 transition-colors">Full Name</label>
               <input type="text" className="w-full bg-foreground/5 dark:bg-white/5 border border-border rounded-xl px-6 py-4 text-foreground dark:text-white focus:outline-none focus:border-secondary transition-colors" placeholder="John Doe" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest ml-1 transition-colors">Email Address</label>
               <input type="email" className="w-full bg-foreground/5 dark:bg-white/5 border border-border rounded-xl px-6 py-4 text-foreground dark:text-white focus:outline-none focus:border-secondary transition-colors" placeholder="john@example.com" />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest ml-1 transition-colors">Inquiry Type</label>
            <select 
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full bg-foreground/5 dark:bg-white/5 border border-border rounded-xl px-6 py-4 text-foreground dark:text-white focus:outline-none focus:border-secondary transition-colors appearance-none"
            >
              <option className="bg-background dark:bg-unity-black">Enrollment Inquiry</option>
              <option className="bg-background dark:bg-unity-black">Partnership Opportunity</option>
              <option className="bg-background dark:bg-unity-black">Media &amp; Press</option>
              <option className="bg-background dark:bg-unity-black">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest ml-1 transition-colors">Message</label>
            <textarea 
              rows={6} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-foreground/5 dark:bg-white/5 border border-border rounded-xl px-6 py-4 text-foreground dark:text-white focus:outline-none focus:border-secondary transition-colors resize-none" 
              placeholder="Tell us about your player..." 
            />
          </div>

          <button className="w-full py-5 bg-secondary text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-lg shadow-secondary/20">
             <span>Send Message</span>
             <Send className="w-4 h-4" />
          </button>
       </form>
    </LiquidGlassCard>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Reach Out</span>
              <h1 className="text-5xl md:text-8xl font-heading font-black text-foreground dark:text-white tracking-tighter leading-none transition-colors">
                Connect <br />
                <span className="text-foreground/40 dark:text-white/40">With Us.</span>
              </h1>
            </div>

            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Location", detail: "Tatu City, Nairobi, Kenya" },
                { icon: Phone, title: "Phone", detail: "+254 707 857 161" },
                { icon: Mail, title: "Email", detail: "info@unitysportsacademy.com" }
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-foreground/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest transition-colors">{item.title}</h4>
                    <p className="text-foreground dark:text-white font-bold text-lg transition-colors">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Abstract Decorative Element */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden glass border-border relative transition-colors">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 contrast-125" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-foreground/10 dark:text-white/10 font-black text-6xl tracking-tighter uppercase transition-colors">Tatu City</span>
               </div>
            </div>
          </div>

          <Suspense fallback={
            <LiquidGlassCard className="p-12 space-y-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground dark:text-white tracking-tight transition-colors">Send a Message</h3>
                <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">Loading form...</p>
              </div>
            </LiquidGlassCard>
          }>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
