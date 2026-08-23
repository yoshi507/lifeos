"use client";

import { useState, useRef, useEffect } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { processAIMessage } from "@/lib/ai";
import { Send, Bot, User, Sparkles, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIPage() {
  const {
    chatMessages,
    addChatMessage,
    applyAIActions,
    clearChat,
    tasks,
    events,
    notes,
    goals,
    habits,
  } = useLifeStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    addChatMessage({ role: "user", content: text });
    setLoading(true);

    try {
      const { reply, actions } = await processAIMessage(text, {
        tasks,
        events,
        notes,
        goals,
        habits,
      });
      if (actions.length > 0) {
        applyAIActions(actions);
      }
      addChatMessage({
        role: "assistant",
        content: reply,
        actions: actions.length > 0 ? actions : undefined,
      });
    } catch (e) {
      addChatMessage({
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Plan my week around school, make sure I have time to exercise, and remind me about my project on Friday.",
    "How am I doing this week?",
    "Add task: Prepare presentation for Monday",
    "Suggest some healthy habits",
    "Break down my top goal into tasks",
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-600" /> AI Assistant
          </h1>
          <p className="text-sm text-zinc-500">
            Talk naturally — I create tasks, events, goals & more
          </p>
        </div>
        <button
          onClick={clearChat}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
                <Sparkles className="h-4 w-4 text-indigo-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              )}
            >
              {msg.content}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {msg.actions
                    .filter((a) => a.type !== "message")
                    .map((a, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-indigo-200/50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200"
                      >
                        {a.type.replace("_", " ")}
                      </span>
                    ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            </div>
            <div className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500 dark:bg-zinc-800">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {chatMessages.length <= 2 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-indigo-950"
            >
              {s.length > 50 ? s.slice(0, 47) + "…" : s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask me to plan, create tasks, analyse… "
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
