"use client";

import { useState, useEffect } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, Trash2, Bell, BellOff } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ReminderRepeat } from "@/types";

export default function RemindersPage() {
  const {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    updateSettings,
  } = useLifeStore();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [datetime, setDatetime] = useState("");
  const [repeat, setRepeat] = useState<ReminderRepeat>("none");
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPerm(p);
    updateSettings({ notificationsEnabled: p === "granted" });
  };

  const sendTestNotification = async () => {
    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }
    if (Notification.permission !== "granted") {
      const p = await Notification.requestPermission();
      setPerm(p);
      if (p !== "granted") {
        alert("Please allow notifications in your browser settings.");
        return;
      }
    }
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.showNotification("LifeOS test", {
            body: "Notifications are working!",
            icon: "/icon-192.png",
            tag: "lifeos-test",
          });
          return;
        }
      }
      new Notification("LifeOS test", {
        body: "Notifications are working!",
        icon: "/icon-192.png",
      });
    } catch (e) {
      alert("Could not show notification: " + (e as Error).message);
    }
  };

  const handleAdd = () => {
    if (!title.trim() || !datetime) return;
    addReminder({
      title: title.trim(),
      message: message.trim() || undefined,
      datetime: new Date(datetime).toISOString(),
      repeat,
      enabled: true,
    });
    setTitle("");
    setMessage("");
    setDatetime("");
    setRepeat("none");
    setShowForm(false);
  };

  const sorted = [...reminders].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Reminders
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            One-time or recurring alerts with browser notifications
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New reminder
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            {perm === "granted" ? (
              <>
                <Bell className="h-4 w-4 text-emerald-500" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Browser notifications enabled
                </span>
              </>
            ) : perm === "unsupported" ? (
              <>
                <BellOff className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-500">
                  Notifications not supported in this browser
                </span>
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 text-amber-500" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Notifications are off — enable to get alerts
                </span>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {perm !== "granted" && perm !== "unsupported" && (
              <button
                onClick={requestPermission}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Enable notifications
              </button>
            )}
            {perm === "granted" && (
              <button
                onClick={sendTestNotification}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                Send test notification
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Reminder title"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            autoFocus
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <div className="flex flex-wrap gap-2">
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as ReminderRepeat)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="none">Once</option>
              <option value="daily">Every day</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
            >
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No reminders yet</p>
          </div>
        ) : (
          sorted.map((r) => (
            <div
              key={r.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900",
                !r.enabled && "opacity-60"
              )}
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950">
                <Bell className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900 dark:text-white">{r.title}</p>
                {r.message && (
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{r.message}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{format(new Date(r.datetime), "MMM d, yyyy · h:mm a")}</span>
                  {r.repeat !== "none" && (
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {r.repeat}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => updateReminder(r.id, { enabled: !r.enabled })}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {r.enabled ? (
                  <Bell className="h-4 w-4 text-indigo-500" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this reminder?")) deleteReminder(r.id);
                }}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
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
