import Link from "next/link";
import { getDailyPrompt, getWeeklyFictionPrompt } from "@/lib/prompts/actions";
import { getDaysUntilNextSaturday } from "@/lib/dates";

export default async function Home() {
  const [dailyPrompt, fictionPrompt] = await Promise.all([
    getDailyPrompt(),
    getWeeklyFictionPrompt(),
  ]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isSaturday = today.getDay() === 6;
  const daysLeft = getDaysUntilNextSaturday();

  return (
    <div className="space-y-12">
      <header>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-2">{formattedDate}</p>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Today&apos;s Writing
        </h1>
      </header>

      {/* Daily Prompt */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
          Daily Prompt
        </h2>
        <div className="p-6 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
          {dailyPrompt ? (
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {dailyPrompt.prompt_text}
            </p>
          ) : (
            <p className="text-stone-500 dark:text-stone-400 italic">
              Loading prompt...
            </p>
          )}
        </div>
        {dailyPrompt && (
          <Link
            href={`/write?type=daily&promptId=${dailyPrompt.id}`}
            className="inline-block px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
          >
            Start Writing
          </Link>
        )}
      </section>

      {/* Weekly Fiction Prompt - Always visible */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            Weekly Fiction Prompt
          </h2>
          {isSaturday ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
              New this week
            </span>
          ) : (
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {daysLeft} {daysLeft === 1 ? "day" : "days"} left
            </span>
          )}
        </div>
        <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
          {fictionPrompt ? (
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {fictionPrompt.prompt_text}
            </p>
          ) : (
            <p className="text-stone-500 dark:text-stone-400 italic">
              Loading prompt...
            </p>
          )}
        </div>
        {fictionPrompt && (
          <Link
            href={`/write?type=fiction&promptId=${fictionPrompt.id}`}
            className="inline-block px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            Start Fiction
          </Link>
        )}
      </section>

      {/* Quick access to recent entries */}
      <section className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            Recent Entries
          </h2>
          <Link
            href="/archive"
            className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            View all
          </Link>
        </div>
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          No entries yet. Start writing to build your collection.
        </p>
      </section>
    </div>
  );
}
