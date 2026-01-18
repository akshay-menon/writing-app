import { notFound } from "next/navigation";
import { getEntryById } from "@/lib/entries/actions";
import { getPromptById } from "@/lib/prompts/actions";
import { EditEntryForm } from "./EditEntryForm";

interface EditEntryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: EditEntryPageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  const prompt = entry.prompt_id ? await getPromptById(entry.prompt_id) : null;

  return (
    <EditEntryForm entry={entry} prompt={prompt} />
  );
}
