"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Trophy,
  Bell,
  Search,
  LogOut,
  Newspaper,
  Menu,
  X,
  Loader2,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  // Guard the routes on mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("unity_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (!isLoginPage) {
          router.replace("/admin/login");
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [isLoginPage, router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("unity_admin_auth");
    toast.success("Terminal Session Terminated. Logged out successfully.");
    router.push("/admin/login");
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Player Registry", href: "/admin/players" },
    { icon: Calendar, label: "Schedule Manager", href: "/admin/schedule" },
    { icon: BarChart3, label: "League Table", href: "/admin/analytics" },
    { icon: Trophy, label: "Fixtures & Results", href: "/admin/leagues" },
    { icon: Newspaper, label: "News & Blog", href: "/admin/news" },
    { icon: HelpCircle, label: "Help Centre", href: "/admin/help" },
  ];

  // If on login page, render children directly without dashboard shell and bypass auth checks
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent layout flashes while checking authentication state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-unity-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  // If check completed and not authenticated, render nothing (router redirecting)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-500 relative overflow-x-hidden">
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar - "Command Center" */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 lg:bg-background border-r border-border flex flex-col p-6 space-y-10 transition-transform duration-300 lg:static lg:translate-x-0 shadow-2xl lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-4 flex items-center justify-between">
          <span className="text-secondary font-black text-xl tracking-tighter">
            UNITY<span className="text-foreground/20 dark:text-white/20">OS</span>
          </span>
          {/* Close button on mobile sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/60 dark:text-white/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.label} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile item click
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-secondary text-white font-bold' 
                    : 'text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white hover:bg-foreground/5 dark:hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 px-4 py-3 text-foreground/40 dark:text-white/40 hover:text-destructive transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">Terminal Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Command Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-6 lg:px-10 transition-colors">
          <div className="flex items-center space-x-4 flex-1">
            {/* Hamburger sidebar toggler for mobile/tablet */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl border border-border bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white transition-all shadow-md active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center bg-foreground/5 dark:bg-white/5 border border-border rounded-full px-6 py-2 w-96 transition-colors">
              <Search className="w-4 h-4 text-foreground/20 dark:text-white/20 mr-3" />
              <input 
                type="text" 
                placeholder="Search players, matches, or logs..." 
                className="bg-transparent border-none text-xs text-foreground dark:text-white focus:outline-none w-full transition-colors" 
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-6">
            <ThemeToggle />
            <button className="relative w-10 h-10 rounded-full glass border border-border flex items-center justify-center text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-all">
               <Bell className="w-4 h-4" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border border-background" />
            </button>
            <div className="flex items-center space-x-3 lg:space-x-4 pl-4 lg:pl-6 border-l border-border transition-colors">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-foreground dark:text-white transition-colors">Director X</p>
                  <p className="text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">Admin Control</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-accent" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
