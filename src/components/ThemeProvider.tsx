"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLifeStore } from "@/store/useLifeStore";

function ThemeSync() {
  const { setTheme, theme } = useTheme();
  const stored = useLifeStore((s) => s.settings.theme);

  useEffect(() => {
    if (stored && stored !== theme) {
      setTheme(stored);
    }
  }, [stored, setTheme, theme]);

  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="lifeos-theme"
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
