"use client";

import { useState } from "react";
import { Search, Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useLifeStore } from "@/store/useLifeStore";
import { cn } from "@/lib/utils";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery, notifications, markNotificationRead } =
    useLifeStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search tasks, notes, goals…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:bg-zinc-900"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Toggle theme"
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute left-2 top-2 h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
            )}
          </button>

          {showNotifs && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifs(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-zinc-500">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={cn(
                          "flex w-full flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 text-left transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50",
                          !n.read && "bg-indigo-50/50 dark:bg-indigo-950/20"
                        )}
                      >
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-zinc-500 line-clamp-2">
                          {n.message}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
