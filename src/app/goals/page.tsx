"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, Target, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, searchQuery } = useLifeStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const filtered = goals.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.title.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    if (!title.trim()) return;
    addGoal({ title: title.trim(), description: description.trim() || undefined, progress: 0, status: "active" });
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
          <p className="text-sm text-zinc-500">Long-term direction for your life</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> New goal
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-900 dark:bg-indigo-950/20">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">Create</button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <Target className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No goals yet. Set your first one!</p>
          </div>
        ) : (
          filtered.map((g) => (
            <div key={g.id} className="group relative rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <button onClick={() => deleteGoal(g.id)} className="absolute right-3 top-3 rounded p-1 text-zinc-400 opacity-0 hover:text-red-500 group-hover:opacity-100">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{g.title}</h3>
                <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase", g.status === "active" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-zinc-100 text-zinc-600")}>{g.status}</span>
              </div>
              {g.description && <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{g.description}</p>}
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-zinc-500">Progress</span>
                  <span className="font-semibold text-indigo-600">{g.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${g.progress}%` }} />
                </div>
                <input type="range" min={0} max={100} value={g.progress} onChange={(e) => updateGoal(g.id, { progress: parseInt(e.target.value) })} className="mt-2 w-full accent-indigo-600" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
