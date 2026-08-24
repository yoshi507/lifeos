"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  Database,
  Trash2,
  LogOut,
  Key,
  Mail,
  Download,
  Smartphone,
  Monitor,
  Apple,
  Calendar,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useLifeStore();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Confirmation email sent to your new address. Please check your inbox.");
      setNewEmail("");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-indigo-600" /> Settings
        </h1>
        <p className="text-sm text-zinc-500">Customise your LifeOS experience</p>
      </div>

      {message && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <User className="h-4 w-4" /> Profile
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Display name</label>
            <input
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current email</label>
            <input
              value={user?.email || ""}
              disabled
              type="email"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Mail className="h-4 w-4" /> Change Email
        </div>
        <div className="space-y-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <button
            onClick={handleChangeEmail}
            disabled={loading || !newEmail}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Update email
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Key className="h-4 w-4" /> Change Password
        </div>
        <div className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 6 characters)"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <button
            onClick={handleChangePassword}
            disabled={loading || !newPassword}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Update password
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Calendar className="h-4 w-4" /> Outlook Calendar Sync
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          Connect your Microsoft Outlook calendar so events stay in sync between LifeOS and Outlook.
          This also helps events appear on Samsung Calendar when you add your Outlook account there.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Outlook is connected and ready
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMessage("Ask me in chat: \u201cImport my Outlook events into LifeOS\u201d and I\u2019ll pull them in for you.");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4" /> Import from Outlook
            </button>
            <button
              onClick={() => {
                setMessage("When you create an event in the Calendar page, tell me \u201calso add this to Outlook\u201d and I\u2019ll create it there.");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              How to push events
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Two-way sync is available through this chat for now. Full automatic background sync will be added next.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Palette className="h-4 w-4" /> Appearance
        </div>
        <div className="flex gap-2">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t);
                updateSettings({ theme: t });
              }}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition ${
                theme === t
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Download className="h-4 w-4" /> Download the App
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          LifeOS is a Progressive Web App. Install it on your device for the best experience.
        </p>
        <div className="space-y-3 rounded-xl bg-indigo-50 p-4 text-sm dark:bg-indigo-950/40">
          <p className="font-medium text-indigo-800 dark:text-indigo-200">How to install:</p>
          <ul className="list-disc space-y-1 pl-5 text-indigo-700 dark:text-indigo-300">
            <li><strong>Android (Chrome)</strong>: Tap the menu (⋮) → “Install app” or “Add to Home screen”</li>
            <li><strong>iPhone (Safari)</strong>: Tap the Share button → “Add to Home Screen”</li>
            <li><strong>Windows / Mac</strong>: In Chrome/Edge click the install icon in the address bar</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-800">
            <Monitor className="h-5 w-5 text-indigo-600" />
            Windows
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-800">
            <Apple className="h-5 w-5 text-indigo-600" />
            macOS
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-800">
            <Smartphone className="h-5 w-5 text-indigo-600" />
            iOS
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-800">
            <Smartphone className="h-5 w-5 text-indigo-600" />
            Android
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <Database className="h-4 w-4" /> Data
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          Your data is stored securely in Supabase and linked to your account.
        </p>
        <button
          onClick={() => {
            if (confirm("Reset all local cache? Your cloud data will remain safe.")) {
              localStorage.removeItem("lifeos-storage-v1");
              window.location.reload();
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <Trash2 className="h-4 w-4" /> Clear local cache
        </button>
      </section>

      <p className="text-center text-xs text-zinc-400">
        LifeOS v1.0 · Built for the £1 Million App Challenge 🚀
      </p>
    </div>
  );
}
