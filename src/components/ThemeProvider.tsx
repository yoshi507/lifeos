"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

/**
 * Theme is owned by next-themes (localStorage key: lifeos-theme).
 * Do NOT sync from Zustand on every theme change — that caused dark mode
 * to flash and immediately revert to light.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="lifeos-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
