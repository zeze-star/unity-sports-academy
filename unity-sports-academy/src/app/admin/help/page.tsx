"use client";

import React, { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Settings, Users, Calendar, Trophy, Newspaper } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: "General",
    question: "How do I switch the admin panel to dark or light mode?",
    answer: "You can toggle the theme using the round button containing a Sun or Moon icon located in the upper-right corner of the header, next to the notification bell."
  },
  {
    category: "Player Registry",
    question: "How do I add a new player to the academy?",
    answer: "Navigate to the 'Player Registry' page using the sidebar menu, click the 'Add New Player' button at the top right, fill in their name, age, squad, position, and status, and click submit. The database will update automatically."
  },
  {
    category: "Player Registry",
    question: "Can I upload a custom image for a player?",
    answer: "Yes, when adding or editing a player, you can select an image file from your device. It will be compressed and uploaded automatically."
  },
  {
    category: "Schedule Manager",
    question: "How do I update training sessions or events?",
    answer: "Go to the 'Schedule Manager' page. Here you can see a weekly view of all training sessions. You can add new sessions by selecting a squad, date, time, and pitch location."
  },
  {
    category: "League Table",
    question: "How do I manage different leagues and standings?",
    answer: "Go to the 'League Table' page. You can switch between active leagues in the sidebar or create a new league using the 'Create League' button. Use the 'Add Standing Team' button to add clubs to the active league. You can also inline-edit wins, draws, losses, and goal differences for any club directly in the table."
  },
  {
    category: "League Table",
    question: "Are matches played and points calculated automatically?",
    answer: "Yes, when you edit a team's wins, draws, or losses on the League Table control panel, the matches played (P) and points (PTS) are computed automatically (3 points for a win, 1 for a draw, 0 for a loss)."
  },
  {
    category: "League Table",
    question: "How do I choose the Player of the Month?",
    answer: "At the bottom of the 'League Table' page, there is a 'Player of the Month' configurator. Select a player from the registry, specify the month, set their position/bio, and upload an optional image. Saving this updates the showcase card on the public Match Schedule page."
  },
  {
    category: "Fixtures & Results",
    question: "How do I input scores for a completed match?",
    answer: "Go to the 'Fixtures & Results' page. Under 'Result Entry' on the right panel, select the match from the dropdown menu, enter the scores for both home and away teams, and click 'Submit Official Result'. This moves the match status to 'RESULT' and displays the scores publicly."
  },
  {
    category: "News & Blog",
    question: "How do I publish an announcement?",
    answer: "Navigate to 'News & Blog'. Click 'Write Article', enter a title, category, publication date, write the body text, upload a cover photo, and save. It will display in the 'Academy Updates' section on the homepage."
  }
];

export default function HelpCentre() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const categories = ["All", "General", "Player Registry", "Schedule Manager", "League Table", "Fixtures & Results", "News & Blog"];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 transition-colors duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tighter transition-colors flex items-center gap-3">
          <HelpCircle className="w-10 h-10 text-secondary" />
          <span>Help Centre &amp; System Manual</span>
        </h1>
        <p className="text-sm text-foreground/40 dark:text-white/40 transition-colors">
          Guides, FAQs, and operation telemetry manuals for the UnityOS administration panel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Admin Panel guides */}
        <div className="lg:col-span-2 space-y-6">
          <LiquidGlassCard className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2 border-b border-border pb-4 transition-colors">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span>How To Administer Unity Sports Academy</span>
            </h2>

            <div className="space-y-6 text-sm text-foreground/75 dark:text-white/75 leading-relaxed">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>1. Player Registry Management</span>
                </h3>
                <p className="text-xs text-foreground/60 dark:text-white/60 pl-6">
                  Maintain the roster of academy trainees. Adding, updating, or deleting player profiles instantly modifies the counts and active player registry metrics. Deleted players are cached locally in the database.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-foreground dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>2. Schedule Manager</span>
                </h3>
                <p className="text-xs text-foreground/60 dark:text-white/60 pl-6">
                  Set daily, weekly, and monthly training rosters. Players and parents refer to this live schedule index on the public website. Always mention the pitch or training ground location.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-foreground dark:text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span>3. League &amp; Match Control Matrix</span>
                </h3>
                <p className="text-xs text-foreground/60 dark:text-white/60 pl-6">
                  Update standings for various youth tournaments. Selecting a league and adding a team creates a live table row. After scheduling upcoming games, you can enter official results in the score collector panel, shifting the status from upcoming to finalized.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-foreground dark:text-white flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-secondary" />
                  <span>4. News Publications</span>
                </h3>
                <p className="text-xs text-foreground/60 dark:text-white/60 pl-6">
                  Add custom posts or blog articles. These populate in the updates feed on the main academy page, letting trainees know about tournament rules, registration openings, or regional Cup announcements.
                </p>
              </div>
            </div>
          </LiquidGlassCard>

          {/* FAQ section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tighter">Frequently Asked Questions</h2>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <input 
                type="text" 
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-foreground/5 dark:bg-white/5 border border-border rounded-xl px-6 py-3 text-xs text-foreground dark:text-white focus:outline-none focus:border-secondary transition-colors"
              />

              <div className="flex flex-wrap gap-2 justify-start w-full md:w-auto">
                {categories.slice(0, 4).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      selectedCategory === cat
                        ? "bg-secondary text-white shadow-md shadow-secondary/15"
                        : "glass text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center glass rounded-2xl text-foreground/40 dark:text-white/40 text-sm">
                  No FAQs matching your query.
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <LiquidGlassCard key={idx} className="p-6 cursor-pointer" onClick={() => toggleFaq(idx)}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded-full">{faq.category}</span>
                      <h4 className="text-sm font-bold text-foreground dark:text-white mr-auto">{faq.question}</h4>
                      {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-foreground/40 dark:text-white/40" /> : <ChevronDown className="w-4 h-4 text-foreground/40 dark:text-white/40" />}
                    </div>
                    {openFaqIndex === idx && (
                      <div className="mt-4 pt-4 border-t border-border text-xs text-foreground/60 dark:text-white/60 leading-relaxed transition-all">
                        {faq.answer}
                      </div>
                    )}
                  </LiquidGlassCard>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column: System Telemetry info card */}
        <div className="space-y-6">
          <LiquidGlassCard className="p-8 space-y-6">
            <h3 className="font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2 border-b border-border pb-4 transition-colors">
              <Settings className="w-4 h-4 text-secondary" />
              <span>Admin Telemetry</span>
            </h3>

            <div className="space-y-4 text-xs font-bold text-foreground/60 dark:text-white/60">
              <div className="flex justify-between">
                <span>OS Version:</span>
                <span className="text-foreground dark:text-white">UnityOS v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Database Sync:</span>
                <span className="text-primary font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Access Layer:</span>
                <span className="text-secondary font-black uppercase tracking-widest">Director Controls</span>
              </div>
              <div className="flex justify-between">
                <span>Build Date:</span>
                <span className="text-foreground dark:text-white">June 2026</span>
              </div>
            </div>
          </LiquidGlassCard>

          <div className="p-8 glass border border-border rounded-3xl space-y-4 text-center">
            <p className="text-xs text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">Need technical assistance?</p>
            <p className="text-sm font-black text-foreground dark:text-white">Email system administrator at support@unitysportsacademy.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
