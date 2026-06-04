"use client";

import { ThemeProvider } from "next-themes";
import { SmoothScrollProvider } from "./SmoothScroll";
import { ToastProvider } from "./ToastProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <ToastProvider>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
