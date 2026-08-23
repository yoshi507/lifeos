"use client";

import { useState } from "react";
import { useLifeStore } from "@/store/useLifeStore";
import { Plus, StickyNote, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, searchQuery } = useLifeStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = notes.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingId) {
      updateNote(editingId, { title: title.trim(), content });
      setEditingId(null);
    } else {
      addNote({ title: title.trim(), content, tags: [] });
    }
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  const startEdit = (id: string) => {
    const n = notes.find((x) => x.id === id);
    if (!n) return;
    setTitle(n.title);
    setContent(n.content);
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-sm text-zinc-500">{notes.length} notes</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setTitle(""); setContent(""); }} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> New note
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-900 dark:bg-indigo-950/20">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something…" rows={4} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
          <div className="flex gap-2">
            <button onClick={handleSave} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">{editingId ? "Update" : "Save"}</button>
            <button onClick={() => setShowForm(false)} className="text-sm text-zinc-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <StickyNote className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No notes yet</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div key={n.id} onClick={() => startEdit(n.id)} className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold line-clamp-1">{n.title}</h3>
                <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} className="rounded p-1 text-zinc-400 opacity-0 hover:text-red-500 group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-zinc-500 line-clamp-3 whitespace-pre-wrap">{n.content}</p>
              <p className="mt-3 text-[11px] text-zinc-400">{format(new Date(n.updatedAt), "MMM d, yyyy")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
