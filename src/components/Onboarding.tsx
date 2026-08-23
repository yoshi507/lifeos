"use client";

import { useState } from "react";
import { Sparkles, CheckSquare, Calendar, Bot, ArrowRight } from "lucide-react";
import { useLifeStore } from "@/store/useLifeStore";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to LifeOS",
    body: "Your personal command centre for tasks, goals, habits, notes and an AI that actually helps you plan.",
  },
  {
    icon: CheckSquare,
    title: "Everything in one place",
    body: "Tasks, calendar, notes, goals and habits — all connected and searchable. No more scattered apps.",
  },
  {
    icon: Bot,
    title: "AI that takes action",
    body: "Tell the assistant “Plan my week around school and exercise” and it creates the tasks, events and habits for you.",
  },
  {
    icon: Calendar,
    title: "Ready to take control?",
    body: "Your sample data is already loaded so you can explore immediately. Customise everything later in Settings.",
  },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useLifeStore((s) => s.completeOnboarding);
  const updateSettings = useLifeStore((s) => s.updateSettings);
  const [name, setName] = useState("Alex");

  const isLast = step === steps.length - 1;
  const Icon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-8 text-white">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Icon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold">{steps[step].title}</h2>
          <p className="mt-2 text-indigo-100 leading-relaxed">
            {steps[step].body}
          </p>
        </div>

        <div className="p-6">
          {isLast && (
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                What should we call you?
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-6 flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-indigo-600" : "w-1.5 bg-zinc-200 dark:bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) {
                  updateSettings({ name: name || "Alex" });
                  completeOnboarding();
                } else {
                  setStep(step + 1);
                }
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
            >
              {isLast ? "Start using LifeOS" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
