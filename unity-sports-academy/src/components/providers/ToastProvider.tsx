"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((val: boolean) => void) | null;
  }>({
    isOpen: false,
    options: { message: "" },
    resolve: null,
  });

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (msg: string) => showToast(msg, "success"),
      error: (msg: string) => showToast(msg, "error"),
      warning: (msg: string) => showToast(msg, "warning"),
      info: (msg: string) => showToast(msg, "info"),
    }),
    [showToast]
  );

  const confirm = useCallback((options: ConfirmOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const parsedOptions =
        typeof options === "string"
          ? { message: options, title: "Confirm Action", confirmText: "Confirm", cancelText: "Cancel" }
          : {
              title: options.title || "Confirm Action",
              message: options.message,
              confirmText: options.confirmText || "Confirm",
              cancelText: options.cancelText || "Cancel",
            };

      setConfirmState({
        isOpen: true,
        options: parsedOptions,
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = (result: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState({
      isOpen: false,
      options: { message: "" },
      resolve: null,
    });
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Dynamic Toast Portal */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = {
              success: CheckCircle,
              error: XCircle,
              warning: AlertCircle,
              info: Info,
            }[t.type];

            const colors = {
              success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/5",
              error: "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-rose-500/5",
              warning: "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/5",
              info: "bg-sky-500/10 border-sky-500/30 text-sky-500 shadow-sky-500/5",
            }[t.type];

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300",
                  colors
                )}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1 text-xs font-bold leading-relaxed">{t.message}</div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                  className="opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cinematic Custom Confirm Modal */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleConfirmClose(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Custom Dialog card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md p-8 bg-card/85 dark:bg-zinc-950/85 border border-border/80 rounded-3xl shadow-2xl space-y-6 backdrop-blur-2xl"
            >
              <div className="space-y-2">
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px] block">
                  Action Required
                </span>
                <h3 className="text-2xl font-black text-foreground dark:text-white tracking-tight">
                  {confirmState.options.title}
                </h3>
              </div>

              <p className="text-sm text-foreground/70 dark:text-white/60 leading-relaxed font-medium">
                {confirmState.options.message}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleConfirmClose(false)}
                  className="px-5 py-3 border border-border text-foreground dark:text-white/80 hover:bg-foreground/5 dark:hover:bg-white/5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  {confirmState.options.cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmClose(true)}
                  className="px-6 py-3 bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/10 hover:scale-105 active:scale-95 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  {confirmState.options.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}

export function useConfirm() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ToastProvider");
  }
  return context.confirm;
}
