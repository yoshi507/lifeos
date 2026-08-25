"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Task,
  CalendarEvent,
  Note,
  Goal,
  Habit,
  NotificationItem,
  UserSettings,
  ChatMessage,
  AIAction,
  Priority,
  TaskStatus,
  TaskList,
  Reminder,
  ReminderRepeat,
} from "@/types";

interface LifeState {
  tasks: Task[];
  events: CalendarEvent[];
  notes: Note[];
  goals: Goal[];
  habits: Habit[];
  lists: TaskList[];
  reminders: Reminder[];
  notifications: NotificationItem[];
  settings: UserSettings;
  chatMessages: ChatMessage[];
  searchQuery: string;

  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "streak" | "bestStreak" | "completedDates">) => void;
  toggleHabitCompletion: (id: string, date?: string) => void;
  deleteHabit: (id: string) => void;

  addList: (name: string, color?: string) => void;
  updateList: (id: string, data: Partial<TaskList>) => void;
  deleteList: (id: string) => void;

  addReminder: (r: Omit<Reminder, "id" | "createdAt" | "lastFired">) => void;
  updateReminder: (id: string, data: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  markReminderFired: (id: string, nextDatetime?: string) => void;

  addNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  updateSettings: (data: Partial<UserSettings>) => void;
  completeOnboarding: () => void;

  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  setSearchQuery: (q: string) => void;

  applyAIActions: (actions: AIAction[]) => void;

  getStats: () => {
    tasksCompletedThisWeek: number;
    tasksTotal: number;
    habitsToday: number;
    activeGoals: number;
    upcomingEvents: number;
  };
}

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

export const useLifeStore = create<LifeState>()(
  persist(
    (set, get) => ({
      tasks: [],
      events: [],
      notes: [],
      goals: [],
      habits: [],
      lists: [],
      reminders: [],
      notifications: [],
      settings: {
        name: "",
        email: "",
        theme: "system",
        weekStartsOn: 1,
        aiEnabled: true,
        onboardingComplete: false,
      },
      chatMessages: [
        {
          id: uuidv4(),
          role: "assistant",
          content:
            "Hi! I'm your LifeOS AI assistant.\n\nI only create tasks, events, goals or habits when you clearly ask me to.\n\nTry: \"Create a task to finish my project by Friday\" or \"Add a daily habit to exercise\".",
          timestamp: now(),
        },
      ],
      searchQuery: "",

      addTask: (task) =>
        set((s) => ({
          tasks: [
            {
              ...task,
              id: uuidv4(),
              createdAt: now(),
              updatedAt: now(),
              tags: task.tags || [],
            },
            ...s.tasks,
          ],
        })),

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: now() } : t
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      toggleTaskStatus: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            const next: TaskStatus =
              t.status === "todo"
                ? "in-progress"
                : t.status === "in-progress"
                ? "done"
                : "todo";
            return { ...t, status: next, updatedAt: now() };
          }),
        })),

      addEvent: (event) =>
        set((s) => ({
          events: [{ ...event, id: uuidv4() }, ...s.events],
        })),

      updateEvent: (id, data) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      addNote: (note) =>
        set((s) => ({
          notes: [
            {
              ...note,
              id: uuidv4(),
              createdAt: now(),
              updatedAt: now(),
              tags: note.tags || [],
            },
            ...s.notes,
          ],
        })),

      updateNote: (id, data) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...data, updatedAt: now() } : n
          ),
        })),

      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addGoal: (goal) =>
        set((s) => ({
          goals: [
            {
              ...goal,
              id: uuidv4(),
              createdAt: now(),
              progress: goal.progress ?? 0,
              status: goal.status ?? "active",
            },
            ...s.goals,
          ],
        })),

      updateGoal: (id, data) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addHabit: (habit) =>
        set((s) => ({
          habits: [
            {
              ...habit,
              id: uuidv4(),
              createdAt: now(),
              streak: 0,
              bestStreak: 0,
              completedDates: [],
            },
            ...s.habits,
          ],
        })),

      toggleHabitCompletion: (id, date = today()) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const has = h.completedDates.includes(date);
            let completedDates = has
              ? h.completedDates.filter((d) => d !== date)
              : [...h.completedDates, date];
            let streak = 0;
            const sorted = [...completedDates].sort().reverse();
            let d = new Date();
            for (const cd of sorted) {
              const expected = d.toISOString().slice(0, 10);
              if (cd === expected) {
                streak++;
                d.setDate(d.getDate() - 1);
              } else break;
            }
            return {
              ...h,
              completedDates,
              streak,
              bestStreak: Math.max(h.bestStreak, streak),
            };
          }),
        })),

      deleteHabit: (id) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      addList: (name, color) =>
        set((s) => ({
          lists: [{ id: uuidv4(), name, color, createdAt: now() }, ...s.lists],
        })),

      updateList: (id, data) =>
        set((s) => ({
          lists: s.lists.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),

      deleteList: (id) =>
        set((s) => ({
          lists: s.lists.filter((l) => l.id !== id),
          tasks: s.tasks.map((t) =>
            t.listId === id ? { ...t, listId: undefined } : t
          ),
        })),

      addReminder: (r) =>
        set((s) => ({
          reminders: [{ ...r, id: uuidv4(), createdAt: now() }, ...s.reminders],
        })),

      updateReminder: (id, data) =>
        set((s) => ({
          reminders: s.reminders.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),

      deleteReminder: (id) =>
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),

      markReminderFired: (id, nextDatetime) =>
        set((s) => ({
          reminders: s.reminders.map((r) => {
            if (r.id !== id) return r;
            return {
              ...r,
              lastFired: now(),
              datetime: nextDatetime || r.datetime,
              enabled: r.repeat === "none" ? false : r.enabled,
            };
          }),
        })),

      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: uuidv4(), createdAt: now(), read: false },
            ...s.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      updateSettings: (data) =>
        set((s) => ({ settings: { ...s.settings, ...data } })),

      completeOnboarding: () =>
        set((s) => ({
          settings: { ...s.settings, onboardingComplete: true },
        })),

      addChatMessage: (msg) =>
        set((s) => ({
          chatMessages: [
            ...s.chatMessages,
            { ...msg, id: uuidv4(), timestamp: now() },
          ],
        })),

      clearChat: () =>
        set({
          chatMessages: [
            {
              id: uuidv4(),
              role: "assistant",
              content: "Chat cleared. How can I help you today?",
              timestamp: now(),
            },
          ],
        }),

      setSearchQuery: (q) => set({ searchQuery: q }),

      applyAIActions: (actions) => {
        const state = get();
        actions.forEach((action) => {
          switch (action.type) {
            case "create_task":
              state.addTask({
                title: action.data.title,
                description: action.data.description,
                status: action.data.status || "todo",
                priority: (action.data.priority as Priority) || "medium",
                dueDate: action.data.dueDate,
                tags: action.data.tags || [],
              });
              break;
            case "create_event":
              state.addEvent({
                title: action.data.title,
                description: action.data.description,
                start: action.data.start,
                end: action.data.end || action.data.start,
                allDay: action.data.allDay ?? false,
                color: action.data.color,
              });
              break;
            case "create_note":
              state.addNote({
                title: action.data.title,
                content: action.data.content || "",
                tags: action.data.tags || [],
              });
              break;
            case "create_goal":
              state.addGoal({
                title: action.data.title,
                description: action.data.description,
                progress: action.data.progress || 0,
                targetDate: action.data.targetDate,
                status: "active",
              });
              break;
            case "create_reminder":
              state.addReminder({
                title: action.data.title,
                message: action.data.message,
                datetime: action.data.datetime,
                repeat: (action.data.repeat as ReminderRepeat) || "none",
                enabled: true,
              });
              break;
            case "create_habit":
              state.addHabit({
                title: action.data.title,
                description: action.data.description,
                frequency: action.data.frequency || "daily",
                color: action.data.color,
              });
              break;
            case "update_task":
              state.updateTask(action.id, action.data);
              break;
            case "complete_task":
              state.updateTask(action.id, { status: "done" });
              break;
            default:
              break;
          }
        });
      },

      getStats: () => {
        const s = get();
        const weekAgo = Date.now() - 7 * 86400000;
        const tasksCompletedThisWeek = s.tasks.filter(
          (t) => t.status === "done" && new Date(t.updatedAt).getTime() > weekAgo
        ).length;
        return {
          tasksCompletedThisWeek,
          tasksTotal: s.tasks.length,
          habitsToday: s.habits.filter((h) =>
            h.completedDates.includes(today())
          ).length,
          activeGoals: s.goals.filter((g) => g.status === "active").length,
          upcomingEvents: s.events.filter(
            (e) => new Date(e.start).getTime() > Date.now()
          ).length,
        };
      },
    }),
    {
      name: "lifeos-storage-v3",
      partialize: (state) => ({
        tasks: state.tasks,
        events: state.events,
        notes: state.notes,
        goals: state.goals,
        habits: state.habits,
        lists: state.lists,
        reminders: state.reminders,
        notifications: state.notifications,
        settings: state.settings,
        chatMessages: state.chatMessages.slice(-50),
      }),
    }
  )
);
