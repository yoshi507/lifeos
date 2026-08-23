"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, Flame, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit } = useLifeStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const handleAdd = () => {
    if (!title.trim()) return;
    addHabit({ title: title.trim(), frequency: "daily" });
    setTitle("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-zinc-500">Build consistency, one day at a time</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> New habit
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="e.g. Drink 2L water" className="mb-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">Add</button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {habits.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <Flame className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No habits yet. Start building one!</p>
          </div>
        ) : (
          habits.map((h) => {
            const done = h.completedDates.includes(today);
            return (
              <div key={h.id} className={cn("group relative rounded-2xl border p-5 transition", done ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900")}>
                <button onClick={() => deleteHabit(h.id)} className="absolute right-3 top-3 rounded p-1 text-zinc-400 opacity-0 hover:text-red-500 group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => toggleHabitCompletion(h.id)} className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold transition", done ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800")}>
                  {done ? "✓" : "○"}
                </button>
                <h3 className="font-semibold">{h.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" />{h.streak} day streak</span>
                  <span>Best: {h.bestStreak}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
