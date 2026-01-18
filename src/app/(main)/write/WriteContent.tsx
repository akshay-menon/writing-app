"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { saveEntry } from "@/lib/entries/actions";
import { CoachPanel } from "@/components/CoachPanel";
import type { Prompt, EntryType } from "@/types/database";

interface WriteContentProps {
  prompt: Prompt | null;
}

export function WriteContent({ prompt }: WriteContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = (searchParams.get("type") || "daily") as EntryType;
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await saveEntry(content, type, prompt?.id);

      if (result.error) {
        setError(result.error);
        return;
      }

      setSaved(true);
      // Redirect to archive after a brief moment
      setTimeout(() => {
        router.push("/archive");
      }, 1500);
    });
  };

  if (saved) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-stone-700 dark:text-stone-300 mb-2">
          Entry saved!
        </p>
        <p className="text-stone-500 dark:text-stone-400">
          Redirecting to archive...
        </p>
      </div>
    );
  }

  // Generate a session key for coach chat persistence
  const sessionKey = prompt?.id || `${type}-${new Date().toISOString().split("T")[0]}`;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          &larr; Back
        </Link>
        <span
          className={`text-xs font-medium uppercase tracking-wide px-2 py-1 rounded ${
            type === "fiction"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
          }`}
        >
          {type}
        </span>
      </div>

      {/* Prompt Display */}
      <div
        className={`p-4 rounded-lg border ${
          type === "fiction"
            ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
            : "bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800"
        }`}
      >
        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
          {prompt?.prompt_text || "No prompt available"}
        </p>
      </div>

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
        placeholder="Start writing..."
        className="writing-area w-full p-4 bg-transparent border border-stone-200 dark:border-stone-800 rounded-lg resize-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
        autoFocus
      />

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {content.length > 0 && `${content.split(/\s+/).filter(Boolean).length} words`}
        </p>
        <button
          onClick={handleSave}
          disabled={!content.trim() || isPending}
          className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Entry"}
        </button>
      </div>
      </div>

      <CoachPanel
        promptText={prompt?.prompt_text || "No prompt available"}
        currentWriting={content}
        entryType={type}
        sessionKey={sessionKey}
      />
    </>
  );
}
