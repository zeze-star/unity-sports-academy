import React from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Check, Shield, Star, Trophy } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Junior Development",
    price: "10,000",
    period: "per year",
    icon: Shield,
    features: [
      "2 Training Sessions per week",
      "Participation in local friendlies",
      "Quarterly Progress Reports",
      "Certified Coach access"
    ]
  },
  {
    name: "Elite Training",
    price: "15,000",
    period: "per year",
    icon: Star,
    featured: true,
    features: [
      "4 Training Sessions per week",
      "Regional League exposure",
      "Monthly 1-on-1 performance review",
      "Sports Science assessment",
      "Video analysis sessions"
    ]
  },
  {
    name: "Professional Pathway",
    price: "20,000",
    period: "per year",
    icon: Trophy,
    features: [
      "Daily Professional Training",
      "Regional Tournament exposure",
      "Dedicated Player Mentor",
      "Scouting network access",
      "Psychological conditioning"
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Academy Enrollment</span>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground dark:text-white tracking-tighter transition-colors">
            Pricing <br />
            <span className="text-foreground/40 dark:text-white/40">Plans.</span>
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest max-w-xl mx-auto pt-2">
            Note: All programs require a constant <span className="text-secondary">KES 5,000</span> annual registration fee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <LiquidGlassCard
              key={plan.name}
              className={`p-12 space-y-8 flex flex-col h-full transition-all ${plan.featured ? 'border-secondary/40 bg-secondary/[0.02]' : ''}`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${plan.featured ? 'bg-secondary text-white' : 'bg-foreground/5 dark:bg-white/5 text-foreground/40 dark:text-white/40 border border-border'}`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground dark:text-white tracking-tight transition-colors">{plan.name}</h3>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-secondary text-sm font-black uppercase tracking-widest">KES</span>
                <span className="text-5xl font-heading font-black text-foreground dark:text-white transition-colors">{plan.price}</span>
                <span className="text-foreground/20 dark:text-white/20 text-xs font-bold uppercase tracking-widest transition-colors">{plan.period}</span>
              </div>

              <ul className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-3 text-foreground/60 dark:text-white/60 text-sm transition-colors">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?plan=${encodeURIComponent(plan.name)}`}
                className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg text-center block ${plan.featured ? 'bg-secondary text-white hover:scale-105 shadow-secondary/20' : 'glass text-foreground dark:text-white hover:bg-secondary hover:text-white'}`}
              >
                Join This Program
              </Link>
            </LiquidGlassCard>
          ))}
        </div>

        {/* Scholarship Program */}
        <div className="section-padding space-y-12">
          <div className="max-w-3xl space-y-6">
            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Accessibility</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground dark:text-white tracking-tighter leading-tight transition-colors">
              Talent Knows <br />
              <span className="text-foreground/40 dark:text-white/40">No Boundaries.</span>
            </h2>
          </div>

          <LiquidGlassCard className="p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-foreground dark:text-white tracking-tight transition-colors">Unity Scholarship Program</h3>
                <p className="text-foreground/60 dark:text-white/60 leading-relaxed text-lg transition-colors">
                  We are committed to discovering and nurturing exceptional talent, regardless of financial background.
                  Our merit-based scholarship program provides full and partial funding for gifted players from across Kenya.
                </p>
                <div className="pt-4">
                  <Link href="/contact?plan=Scholarship" className="px-8 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-secondary/20 inline-block text-center">
                    Apply For Assessment
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 glass border-border rounded-2xl text-center space-y-2 transition-colors">
                  <span className="text-secondary font-black text-3xl">50+</span>
                  <p className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">Active Scholars</p>
                </div>
                <div className="p-6 glass border-border rounded-2xl text-center space-y-2 transition-colors">
                  <span className="text-foreground dark:text-white font-black text-3xl transition-colors">100%</span>
                  <p className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">Funding Support</p>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>

        {/* Corporate Partnerships */}
        <div className="bg-foreground/5 dark:bg-white/5 rounded-[40px] p-12 md:p-20 border border-border text-center space-y-8 transition-colors">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-foreground dark:text-white transition-colors">Corporate Academy Partnerships</h3>
            <p className="text-foreground/40 dark:text-white/40 text-sm transition-colors">
              Empower the next generation of Kenyan athletes. Partner with Unity Sports Academy
              to provide equipment, nutrition, or facility support.
            </p>
          </div>
          <Link href="/contact?plan=Corporate%20Partnership" className="text-secondary font-bold text-xs uppercase tracking-[0.3em] hover:opacity-80 transition-opacity inline-block">
            Inquire About Partnerships
          </Link>
        </div>
      </div>
    </div>
  );
}
