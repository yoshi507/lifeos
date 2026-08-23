"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  StickyNote,
  Target,
  Flame,
  Bot,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLifeStore } from "@/store/useLifeStore";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/ai", label: "AI Assistant", icon: Bot },
  { href: "/stats", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const unread = useLifeStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
            LifeOS
          </h1>
          <p className="text-[11px] font-medium text-zinc-500">Command Centre</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                )}
              />
              {item.label}
              {item.href === "/ai" && unread > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-3 dark:from-indigo-500/20 dark:to-violet-500/20">
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Pro tip ✨
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Talk to the AI like a real assistant. Try “Plan my week…”
          </p>
        </div>
      </div>
    </aside>
  );
}
