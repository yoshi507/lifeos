"use client";

import { useEffect } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { addDays, addMonths, setHours, setMinutes, setSeconds } from "date-fns";

function nextOccurrence(from: Date, repeat: string): Date {
  if (repeat === "daily") return addDays(from, 1);
  if (repeat === "weekly") return addDays(from, 7);
  if (repeat === "monthly") return addMonths(from, 1);
  if (repeat === "weekdays") {
    let d = addDays(from, 1);
    while (d.getDay() === 0 || d.getDay() === 6) d = addDays(d, 1);
    return d;
  }
  return from;
}

export function ReminderChecker() {
  const reminders = useLifeStore((s) => s.reminders);
  const markReminderFired = useLifeStore((s) => s.markReminderFired);
  const addNotification = useLifeStore((s) => s.addNotification);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const state = useLifeStore.getState();
      for (const r of state.reminders) {
        if (!r.enabled) continue;
        const when = new Date(r.datetime).getTime();
        if (when <= now && when > now - 60000) {
          if (r.lastFired && new Date(r.lastFired).getTime() > when - 1000) {
            continue;
          }

          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              try {
                new Notification(r.title, {
                  body: r.message || "LifeOS reminder",
                  icon: "/icon-192.png",
                  tag: r.id,
                });
              } catch {
                // ignore
              }
            }
          }

          addNotification({
            title: r.title,
            message: r.message || "Reminder",
            type: "reminder",
          });

          if (r.repeat === "none") {
            markReminderFired(r.id);
          } else {
            const base = new Date(r.datetime);
            const next = nextOccurrence(base, r.repeat);
            const withTime = setSeconds(
              setMinutes(setHours(next, base.getHours()), base.getMinutes()),
              0
            );
            markReminderFired(r.id, withTime.toISOString());
          }
        }
      }
    };

    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [reminders, markReminderFired, addNotification]);

  return null;
}
