import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntryById } from "@/lib/entries/actions";
import { getPromptById } from "@/lib/prompts/actions";
import { DeleteEntryButton } from "./DeleteEntryButton";

interface EntryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  const prompt = entry.prompt_id ? await getPromptById(entry.prompt_id) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/archive"
          className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          &larr; Back to Archive
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/archive/${id}/edit`}
            className="px-3 py-1.5 text-sm border border-stone-300 dark:border-stone-700 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Edit
          </Link>
          <DeleteEntryButton entryId={id} />
        </div>
      </div>

      <header className="flex items-center gap-3">
        <span
          className={`text-xs font-medium uppercase tracking-wide px-2 py-1 rounded ${
            entry.entry_type === "fiction"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
          }`}
        >
          {entry.entry_type}
        </span>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {new Date(entry.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Prompt */}
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

      {/* Entry Content */}
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
          {entry.entry_text}
        </p>
      </div>

      {/* Word count */}
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {entry.entry_text.split(/\s+/).filter(Boolean).length} words
      </p>
    </div>
  );
}
