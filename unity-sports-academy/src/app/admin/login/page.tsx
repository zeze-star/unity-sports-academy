"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { Eye, EyeOff, Lock, Mail, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password flow states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Initialize default password in local storage if not already there
  useEffect(() => {
    if (!localStorage.getItem("unity_admin_password")) {
      localStorage.setItem("unity_admin_password", "admin2026");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);

    // Simulate authenticating delay
    setTimeout(() => {
      const storedPassword = localStorage.getItem("unity_admin_password") || "admin2026";
      const expectedEmail = "admin@unitysports.com";

      if (email.toLowerCase() === expectedEmail && password === storedPassword) {
        localStorage.setItem("unity_admin_auth", "true");
        toast.success("Command Access Granted! Welcome back Director.");
        router.push("/admin");
      } else {
        toast.error("Access Denied! Invalid credentials.");
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all recovery fields.");
      return;
    }

    if (forgotEmail.toLowerCase() !== "admin@unitysports.com") {
      toast.error("Unrecognized administrator email address.");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsResetting(true);

    setTimeout(() => {
      localStorage.setItem("unity_admin_password", newPassword);
      toast.success("Security Credentials Updated Successfully!");
      setIsResetting(false);
      setIsForgotMode(false);
      setPassword(""); // Clear password field
      setForgotEmail("");
      setNewPassword("");
      setConfirmNewPassword("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-unity-black flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Cinematic Dark Background & Glowing Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_60%)] animate-pulse" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary/15 blur-[150px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          {!isForgotMode ? (
            /* Login Card */
            <motion.div
              key="login-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="p-8 md:p-12 bg-zinc-950/70 border border-white/10 rounded-[36px] shadow-2xl backdrop-blur-3xl space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-20 h-20 group transition-transform hover:scale-105 duration-300">
                  <Image 
                    src="/LOGO_V1-removebg-preview.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain" 
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-secondary font-black tracking-[0.25em] uppercase text-[10px]">
                    Unity Sports OS
                  </span>
                  <h2 className="text-3xl font-heading font-black text-white tracking-tight leading-none">
                    Command Portal
                  </h2>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest pl-1">
                    Security Email
                  </label>
                  <div className="relative flex items-center group">
                    <Mail className="absolute left-4 w-4 h-4 text-white/30 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="admin@unitysports.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Secret Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-[10px] text-secondary hover:text-secondary/80 font-bold uppercase tracking-widest transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center group">
                    <Lock className="absolute left-4 w-4 h-4 text-white/30 group-focus-within:text-secondary transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-white/30 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/15 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:scale-100 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Initialize Access</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed">
                  Default login for testing: <br />
                  <span className="text-secondary font-black">admin@unitysports.com</span> / <span className="text-secondary font-black">admin2026</span>
                </p>
              </div>
            </motion.div>
          ) : (
            /* Forgot Password Card */
            <motion.div
              key="forgot-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="p-8 md:p-12 bg-zinc-950/70 border border-white/10 rounded-[36px] shadow-2xl backdrop-blur-3xl space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                  <KeyRound className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="text-secondary font-black tracking-[0.25em] uppercase text-[10px]">
                    Security Recovery
                  </span>
                  <h2 className="text-3xl font-heading font-black text-white tracking-tight leading-none">
                    Reset Credentials
                  </h2>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* Registered Email */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest pl-1">
                    Registered Admin Email
                  </label>
                  <div className="relative flex items-center group">
                    <Mail className="absolute left-4 w-4 h-4 text-white/30 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="admin@unitysports.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest pl-1">
                    New Security Password
                  </label>
                  <div className="relative flex items-center group">
                    <Lock className="absolute left-4 w-4 h-4 text-white/30 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest pl-1">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center group">
                    <Lock className="absolute left-4 w-4 h-4 text-white/30 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Reset */}
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/15 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isResetting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Apply New Credentials</span>
                      <RefreshCw className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="w-full py-3 border border-white/10 text-white/60 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  Cancel Recovery
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
