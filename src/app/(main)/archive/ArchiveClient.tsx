"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Entry } from "@/types/database";

interface ArchiveClientProps {
  initialEntries: Entry[];
}

export function ArchiveClient({ initialEntries }: ArchiveClientProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | "daily" | "fiction">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Filter entries client-side for immediate response
  const filteredEntries = useMemo(() => {
    return initialEntries.filter((entry) => {
      // Type filter
      if (typeFilter !== "all" && entry.entry_type !== typeFilter) {
        return false;
      }

      // Date filters
      const entryDate = new Date(entry.created_at);

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (entryDate < fromDate) return false;
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1); // Include the end date
        if (entryDate >= toDate) return false;
      }

      return true;
    });
  }, [initialEntries, typeFilter, dateFrom, dateTo]);

  const handleExportMarkdown = () => {
    if (filteredEntries.length === 0) return;

    const markdown = filteredEntries
      .map((entry) => {
        const date = new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return `# ${entry.entry_type.charAt(0).toUpperCase() + entry.entry_type.slice(1)} - ${date}\n\n${entry.entry_text}\n\n---\n`;
      })
      .join("\n");

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `writing-entries-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (filteredEntries.length === 0) return;

    const data = filteredEntries.map((entry) => ({
      type: entry.entry_type,
      date: entry.created_at,
      content: entry.entry_text,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `writing-entries-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = typeFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Archive
        </h1>
      </header>

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "daily" | "fiction")}
              className="text-sm px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            >
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="fiction">Fiction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="text-sm px-3 py-1.5 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-stone-500 dark:text-stone-400">
          Showing {filteredEntries.length} of {initialEntries.length} entries
        </p>
      </section>

      {filteredEntries.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          {initialEntries.length === 0 ? (
            <>
              <p className="text-stone-500 dark:text-stone-400 mb-4">
                Your archive is empty. Start writing to see your entries here.
              </p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
              >
                Go to Today&apos;s Prompts
              </Link>
            </>
          ) : (
            <p className="text-stone-500 dark:text-stone-400">
              No entries match your filters.
            </p>
          )}
        </div>
      ) : (
        /* Entry List */
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded ${
                    entry.entry_type === "fiction"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  }`}
                >
                  {entry.entry_type}
                </span>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {new Date(entry.created_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 line-clamp-3">
                {entry.entry_text}
              </p>
              <Link
                href={`/archive/${entry.id}`}
                className="inline-block mt-3 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              >
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Export Section */}
      {initialEntries.length > 0 && (
        <section className="pt-8 border-t border-stone-200 dark:border-stone-800">
          <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
            Export
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportMarkdown}
              disabled={filteredEntries.length === 0}
              className="px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export as Markdown
            </button>
            <button
              onClick={handleExportJSON}
              disabled={filteredEntries.length === 0}
              className="px-3 py-1.5 text-sm border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export as JSON
            </button>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            {hasActiveFilters
              ? `Export will include ${filteredEntries.length} filtered entries.`
              : `Export will include all ${initialEntries.length} entries.`}
          </p>
        </section>
      )}
    </div>
  );
}
