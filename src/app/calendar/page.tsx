"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useLifeStore();
  const [current, setCurrent] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleAdd = () => {
    if (!title.trim()) return;
    addEvent({
      title: title.trim(),
      start: new Date(date).toISOString(),
      end: new Date(date).toISOString(),
      allDay: true,
      color: "#6366f1",
    });
    setTitle("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-sm text-zinc-500">Your schedule at a glance</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add event
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-900 dark:bg-indigo-950/20">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">Add</button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setCurrent(subMonths(current, 1))} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">{format(current, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrent(addMonths(current, 1))} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.start), day));
            return (
              <div key={day.toISOString()} className={cn("aspect-square rounded-lg border p-1 text-left transition", isToday(day) ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30" : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50", !isSameMonth(day, current) && "opacity-40")}>
                <span className={cn("text-xs font-medium", isToday(day) && "text-indigo-600")}>
                  {format(day, "d")}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="truncate rounded px-0.5 text-[9px] font-medium text-white" style={{ backgroundColor: e.color || "#6366f1" }}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">All events</h3>
        {events.length === 0 ? (
          <p className="text-sm text-zinc-500">No events yet</p>
        ) : (
          events
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-8 w-1 rounded-full" style={{ backgroundColor: e.color || "#6366f1" }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-zinc-500">{format(new Date(e.start), e.allDay ? "MMM d, yyyy" : "MMM d · HH:mm")}</p>
                </div>
                <button onClick={() => deleteEvent(e.id)} className="rounded p-1.5 text-zinc-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
