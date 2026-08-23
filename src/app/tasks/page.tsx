"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Priority, TaskStatus } from "@/types";

export default function TasksPage() {
  const { tasks, addTask, deleteTask, toggleTaskStatus, searchQuery } = useLifeStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  const filtered = tasks
    .filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), status: "todo", priority, tags: [] });
    setTitle("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-zinc-500">
            {tasks.filter((t) => t.status !== "done").length} open · {tasks.filter((t) => t.status === "done").length} done
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "todo", "in-progress", "done"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition", filter === f ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400")}>
            {f === "all" ? "All" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="What needs to be done?" className="mb-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900" />
          <div className="flex flex-wrap items-center gap-3">
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button onClick={handleAdd} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">Add</button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-zinc-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <CheckSquare className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No tasks match your filters</p>
          </div>
        ) : (
          filtered.map((task) => (
            <div key={task.id} className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <button onClick={() => toggleTaskStatus(task.id)} className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition", task.status === "done" ? "border-emerald-500 bg-emerald-500 text-white" : task.status === "in-progress" ? "border-amber-500" : "border-zinc-300 dark:border-zinc-600")}>
                {task.status === "done" && (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12"><path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" /></svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn("font-medium", task.status === "done" && "line-through text-zinc-400")}>{task.title}</p>
                {task.description && <p className="mt-0.5 text-sm text-zinc-500 line-clamp-1">{task.description}</p>}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase", task.priority === "high" ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400" : task.priority === "medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800")}>{task.priority}</span>
                  <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] capitalize text-zinc-600 dark:bg-zinc-800">{task.status.replace("-", " ")}</span>
                  {task.dueDate && <span className="text-xs text-zinc-500">Due {format(new Date(task.dueDate), "MMM d")}</span>}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="rounded-lg p-1.5 text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
