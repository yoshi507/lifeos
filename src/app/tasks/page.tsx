"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, Trash2, ListPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Priority, TaskStatus } from "@/types";

const priorityStyles: Record<Priority, string> = {
  urgent: "border-l-4 border-l-red-600 bg-red-50/80 dark:bg-red-950/40",
  high: "border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/30",
  medium: "border-l-4 border-l-amber-400 bg-white dark:bg-zinc-900",
  low: "border-l-4 border-l-zinc-300 bg-white dark:border-l-zinc-600 dark:bg-zinc-900",
};

const priorityBadge: Record<Priority, string> = {
  urgent: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function TasksPage() {
  const {
    tasks,
    lists,
    addTask,
    deleteTask,
    toggleTaskStatus,
    addList,
    deleteList,
    searchQuery,
  } = useLifeStore();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [listId, setListId] = useState("");
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [activeList, setActiveList] = useState("all");
  const [newListName, setNewListName] = useState("");
  const [showListForm, setShowListForm] = useState(false);

  const filtered = tasks
    .filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (activeList === "inbox" && t.listId) return false;
      if (activeList !== "all" && activeList !== "inbox" && t.listId !== activeList)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const order: Record<Priority, number> = {
        urgent: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      return order[a.priority] - order[b.priority];
    });

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      status: "todo",
      priority,
      tags: [],
      listId: listId || undefined,
    });
    setTitle("");
    setShowForm(false);
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addList(newListName.trim());
    setNewListName("");
    setShowListForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {tasks.filter((t) => t.status !== "done").length} open ·{" "}
            {tasks.filter((t) => t.status === "done").length} done
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveList("all")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition",
            activeList === "all"
              ? "bg-indigo-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveList("inbox")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition",
            activeList === "inbox"
              ? "bg-indigo-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          )}
        >
          Inbox
        </button>
        {lists.map((l) => (
          <div key={l.id} className="group relative flex items-center">
            <button
              onClick={() => setActiveList(l.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                activeList === l.id
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              )}
            >
              {l.name}
            </button>
            <button
              onClick={() => deleteList(l.id)}
              className="ml-0.5 rounded p-1 text-zinc-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
              title="Delete list"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {showListForm ? (
          <div className="flex items-center gap-1">
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddList()}
              placeholder="List name"
              className="w-28 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              autoFocus
            />
            <button onClick={handleAddList} className="rounded-lg bg-indigo-600 px-2 py-1 text-xs text-white">
              Add
            </button>
            <button onClick={() => setShowListForm(false)} className="text-xs text-zinc-500">
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowListForm(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-600"
          >
            <ListPlus className="h-3.5 w-3.5" /> New list
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "todo", "in-progress", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
              filter === f
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            )}
          >
            {f === "all" ? "All statuses" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What needs doing?"
            className="mb-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            autoFocus
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">Inbox (no list)</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <button onClick={handleAdd} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">
              Add
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No tasks yet. Create one or ask the AI.
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-start gap-3 rounded-xl border border-zinc-200 p-4 transition hover:shadow-sm dark:border-zinc-800",
                priorityStyles[task.priority]
              )}
            >
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                  task.status === "done"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : task.status === "in-progress"
                    ? "border-amber-500"
                    : "border-zinc-300 dark:border-zinc-600"
                )}
              >
                {task.status === "done" && (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                  </svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-medium text-zinc-900 dark:text-zinc-100",
                    task.status === "done" && "line-through text-zinc-400 dark:text-zinc-500"
                  )}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="mt-0.5 text-sm text-zinc-500 line-clamp-1 dark:text-zinc-400">
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                      priorityBadge[task.priority]
                    )}
                  >
                    {task.priority}
                  </span>
                  <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {task.status.replace("-", " ")}
                  </span>
                  {task.listId && (
                    <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {lists.find((l) => l.id === task.listId)?.name || "List"}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Due {format(new Date(task.dueDate), "MMM d")}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm("Delete this task permanently?")) deleteTask(task.id);
                }}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
