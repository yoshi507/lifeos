"use client";

import { useEffect, useRef } from "react";
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

async function showBrowserNotification(title: string, body: string, tag: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag,
          requireInteraction: false,
        });
        return true;
      }
    }
    new Notification(title, {
      body,
      icon: "/icon-192.png",
      tag,
    });
    return true;
  } catch {
    try {
      new Notification(title, { body, icon: "/icon-192.png", tag });
      return true;
    } catch {
      return false;
    }
  }
}

export function ReminderChecker() {
  const markReminderFired = useLifeStore((s) => s.markReminderFired);
  const addNotification = useLifeStore((s) => s.addNotification);
  const firedThisSession = useRef<Set<string>>(new Set());

  useEffect(() => {
    const tick = async () => {
      const now = Date.now();
      const state = useLifeStore.getState();

      for (const r of state.reminders) {
        if (!r.enabled) continue;

        const when = new Date(r.datetime).getTime();
        if (when > now) continue;

        const occurrenceKey = `${r.id}-${r.datetime}`;
        if (firedThisSession.current.has(occurrenceKey)) continue;
        if (r.lastFired && new Date(r.lastFired).getTime() >= when) continue;

        firedThisSession.current.add(occurrenceKey);

        await showBrowserNotification(
          r.title,
          r.message || "LifeOS reminder",
          r.id
        );

        addNotification({
          title: r.title,
          message: r.message || "Reminder",
          type: "reminder",
        });

        if (r.repeat === "none") {
          markReminderFired(r.id);
        } else {
          let base = new Date(r.datetime);
          let next = nextOccurrence(base, r.repeat);
          let withTime = setSeconds(
            setMinutes(setHours(next, base.getHours()), base.getMinutes()),
            0
          );
          while (withTime.getTime() <= now) {
            base = withTime;
            next = nextOccurrence(base, r.repeat);
            withTime = setSeconds(
              setMinutes(setHours(next, base.getHours()), base.getMinutes()),
              0
            );
          }
          markReminderFired(r.id, withTime.toISOString());
        }
      }
    };

    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [markReminderFired, addNotification]);

  return null;
}
