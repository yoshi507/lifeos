"use client";

import { useLifeStore } from "@/store/useLifeStore";
import { BarChart3, CheckSquare, Flame, Target, TrendingUp } from "lucide-react";

export default function StatsPage() {
  const { tasks, habits, goals, getStats } = useLifeStore();
  const stats = getStats();

  const completed = tasks.filter((t) => t.status === "done").length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const avgGoalProgress = goals.length
    ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
    : 0;
  const totalStreak = habits.reduce((a, h) => a + h.streak, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-600" /> Analytics
        </h1>
        <p className="text-sm text-zinc-500">Your productivity at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Task completion", value: `${completionRate}%`, sub: `${completed}/${tasks.length} tasks`, icon: CheckSquare, color: "from-emerald-500 to-teal-500" },
          { label: "Tasks this week", value: stats.tasksCompletedThisWeek, sub: "completed", icon: TrendingUp, color: "from-indigo-500 to-violet-500" },
          { label: "Avg goal progress", value: `${avgGoalProgress}%`, sub: `${goals.length} goals`, icon: Target, color: "from-amber-500 to-orange-500" },
          { label: "Active streaks", value: totalStreak, sub: `${habits.length} habits`, icon: Flame, color: "from-rose-500 to-pink-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${s.color} p-2.5 text-white`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-3xl font-bold tracking-tight">{s.value}</p>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{s.label}</p>
            <p className="text-xs text-zinc-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">Tasks by status</h2>
          <div className="space-y-3">
            {(["todo", "in-progress", "done"] as const).map((status) => {
              const count = tasks.filter((t) => t.status === status).length;
              const pct = tasks.length ? (count / tasks.length) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize text-zinc-600 dark:text-zinc-400">{status.replace("-", " ")}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className={`h-full rounded-full transition-all ${status === "done" ? "bg-emerald-500" : status === "in-progress" ? "bg-amber-500" : "bg-zinc-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">Habit streaks</h2>
          <div className="space-y-3">
            {habits.length === 0 ? (
              <p className="text-sm text-zinc-500">No habits tracked yet</p>
            ) : (
              habits.map((h) => (
                <div key={h.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-sm font-bold text-orange-600 dark:bg-orange-950">
                    {h.streak}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{h.title}</p>
                    <p className="text-xs text-zinc-500">Best: {h.bestStreak} days</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
