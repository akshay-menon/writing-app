import { Suspense } from "react";
import { getPromptById } from "@/lib/prompts/actions";
import { WriteContent } from "./WriteContent";

interface WritePageProps {
  searchParams: Promise<{ type?: string; promptId?: string }>;
}

export default async function WritePage({ searchParams }: WritePageProps) {
  const params = await searchParams;
  const promptId = params.promptId;

  const prompt = promptId ? await getPromptById(promptId) : null;

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-6 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
          <div className="h-24 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
          <div className="h-64 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
        </div>
      }
    >
      <WriteContent prompt={prompt} />
    </Suspense>
  );
}
