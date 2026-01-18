"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateEntry } from "@/lib/entries/actions";
import type { Entry, Prompt } from "@/types/database";

interface EditEntryFormProps {
  entry: Entry;
  prompt: Prompt | null;
}

export function EditEntryForm({ entry, prompt }: EditEntryFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(entry.entry_text);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!content.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await updateEntry(entry.id, content);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(`/archive/${entry.id}`);
    });
  };

  const hasChanges = content !== entry.entry_text;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/archive/${entry.id}`}
          className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          &larr; Cancel
        </Link>
        <span
          className={`text-xs font-medium uppercase tracking-wide px-2 py-1 rounded ${
            entry.entry_type === "fiction"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
          }`}
        >
          {entry.entry_type}
        </span>
      </div>

      <header>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Edit Entry
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {new Date(entry.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Prompt Display */}
      {prompt && (
        <div
          className={`p-4 rounded-lg border ${
            entry.entry_type === "fiction"
              ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
              : "bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800"
          }`}
        >
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
            Prompt
          </p>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {prompt.prompt_text}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Writing Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="writing-area w-full p-4 bg-transparent border border-stone-200 dark:border-stone-800 rounded-lg resize-none text-stone-900 dark:text-stone-100"
        autoFocus
      />

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {content.split(/\s+/).filter(Boolean).length} words
          {hasChanges && <span className="ml-2 text-amber-600">(unsaved changes)</span>}
        </p>
        <button
          onClick={handleSave}
          disabled={!content.trim() || isPending || !hasChanges}
          className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
