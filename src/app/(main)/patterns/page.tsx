"use client";

import { useState, useTransition } from "react";
import { runAnalysis } from "@/lib/analysis/actions";
import type { AnalysisType } from "@/lib/analysis/analyze";

const analysisOptions: { type: AnalysisType; title: string; description: string }[] = [
  {
    type: "themes",
    title: "Thematic Connections",
    description: "Find recurring themes and motifs across your entries",
  },
  {
    type: "characters",
    title: "Characters & Settings",
    description: "Identify recurring characters, places, and worlds in your fiction",
  },
  {
    type: "style",
    title: "Stylistic Patterns",
    description: "Analyze your writing style, voice, and craft tendencies",
  },
  {
    type: "stories",
    title: "Story Threads",
    description: "Discover entries that could connect into larger stories",
  },
];

export default function PatternsPage() {
  const [isPending, startTransition] = useTransition();
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType | null>(null);
  const [result, setResult] = useState<{ title: string; analysis: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = (type: AnalysisType) => {
    setError(null);
    setActiveAnalysis(type);

    startTransition(async () => {
      const response = await runAnalysis(type);

      if (response.error) {
        setError(response.error);
        setResult(null);
      } else {
        setResult({ title: response.title, analysis: response.analysis });
      }
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Patterns
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Discover themes, recurring elements, and potential story connections in your writing.
        </p>
      </header>

      {/* Analysis Options */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
          Analysis Types
        </h2>
        <div className="grid gap-3">
          {analysisOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleAnalyze(option.type)}
              disabled={isPending}
              className={`p-4 text-left border rounded-lg transition-colors disabled:opacity-50 ${
                activeAnalysis === option.type && isPending
                  ? "border-stone-400 bg-stone-100 dark:border-stone-600 dark:bg-stone-800"
                  : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50"
              }`}
            >
              <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Analysis Result */}
      {(isPending || result || error) && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            Results
          </h2>
          <div className="p-6 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            {isPending ? (
              <div className="space-y-2">
                <p className="text-stone-600 dark:text-stone-400">
                  Analyzing your writing...
                </p>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : result ? (
              <div>
                <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-4">
                  {result.title}
                </h3>
                <div className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                  {result.analysis}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Info */}
      <section className="pt-8 border-t border-stone-200 dark:border-stone-800">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Pattern analysis uses AI to find connections in your writing.
          The more you write, the richer the patterns that can be discovered.
        </p>
      </section>
    </div>
  );
}
