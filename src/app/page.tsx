"use client";

import { useLifeStore } from "@/store/useLifeStore";
import {
  CheckSquare,
  Target,
  Flame,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const {
    tasks,
    goals,
    habits,
    events,
    settings,
    getStats,
    toggleTaskStatus,
    toggleHabitCompletion,
  } = useLifeStore();
  const stats = getStats();
  const today = new Date().toISOString().slice(0, 10);

  const openTasks = tasks.filter((t) => t.status !== "done").slice(0, 5);
  const activeGoals = goals.filter((g) => g.status === "active").slice(0, 3);
  const upcoming = events
    .filter((e) => new Date(e.start) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {settings.name} 👋
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {format(new Date(), "EEEE, MMMM d")} · Your personal command centre
          </p>
        </div>
        <Link
          href="/ai"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 sm:mt-0"
        >
          Ask AI Assistant
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Tasks done (7d)",
            value: stats.tasksCompletedThisWeek,
            icon: CheckSquare,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
          },
          {
            label: "Active goals",
            value: stats.activeGoals,
            icon: Target,
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
          },
          {
            label: "Habits today",
            value: `${stats.habitsToday}/${habits.length}`,
            icon: Flame,
            color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
          },
          {
            label: "Upcoming",
            value: stats.upcomingEvents,
            icon: Calendar,
            color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className={cn("mb-3 inline-flex rounded-xl p-2", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's focus</h2>
            <Link href="/tasks" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">View all</Link>
          </div>
          <div className="space-y-2">
            {openTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <CheckSquare className="mx-auto h-8 w-8 text-zinc-300" />
                <p className="mt-2 text-sm text-zinc-500">No open tasks. Nice work!</p>
                <Link href="/tasks" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                  <Plus className="h-4 w-4" /> Add a task
                </Link>
              </div>
            ) : (
              openTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  className="flex w-full items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 text-left transition hover:border-indigo-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                      task.status === "done"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : task.status === "in-progress"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                        : "border-zinc-300 dark:border-zinc-600"
                    )}
                  >
                    {task.status === "done" && (
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-medium", task.status === "done" && "line-through text-zinc-400")}>
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                          task.priority === "high"
                            ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : task.priority === "medium"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        )}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-zinc-500">
                          {format(new Date(task.dueDate), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Habits</h2>
              <Link href="/habits" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">All</Link>
            </div>
            <div className="space-y-2">
              {habits.slice(0, 4).map((h) => {
                const done = h.completedDates.includes(today);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabitCompletion(h.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 transition",
                      done
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                        done ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"
                      )}
                    >
                      {done ? "✓" : h.streak}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium">{h.title}</p>
                      <p className="text-xs text-zinc-500">{h.streak} day streak</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Goals</h2>
              <Link href="/goals" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">All</Link>
            </div>
            <div className="space-y-3">
              {activeGoals.map((g) => (
                <div key={g.id} className="rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{g.title}</p>
                    <span className="text-xs font-semibold text-indigo-600">{g.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
