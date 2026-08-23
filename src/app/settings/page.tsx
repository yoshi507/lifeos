"use client";

import { useLifeStore } from "@/store/useLifeStore";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, User, Palette, Database, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useLifeStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-indigo-600" /> Settings
        </h1>
        <p className="text-sm text-zinc-500">Customise your LifeOS experience</p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <User className="h-4 w-4" /> Profile
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Display name</label>
            <input value={settings.name} onChange={(e) => updateSettings({ name: e.target.value })} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input value={settings.email} onChange={(e) => updateSettings({ email: e.target.value })} type="email" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Palette className="h-4 w-4" /> Appearance
        </div>
        <div className="flex gap-2">
          {(["light", "dark", "system"] as const).map((t) => (
            <button key={t} onClick={() => { setTheme(t); updateSettings({ theme: t }); }} className={`flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition ${theme === t ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"}`}>
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Database className="h-4 w-4" /> Data
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          All your data is stored locally in this browser (localStorage). Clearing browser data will reset the app.
        </p>
        <button onClick={() => { if (confirm("Reset all LifeOS data? This cannot be undone.")) { localStorage.removeItem("lifeos-storage-v1"); window.location.reload(); } }} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <Trash2 className="h-4 w-4" /> Reset all data
        </button>
      </section>

      <p className="text-center text-xs text-zinc-400">
        LifeOS v1.0 · Built for the £1 Million App Challenge 🚀
      </p>
    </div>
  );
}
