import Anthropic from "@anthropic-ai/sdk";
import type { Entry } from "@/types/database";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type AnalysisType = "themes" | "characters" | "style" | "stories";

const ANALYSIS_PROMPTS: Record<AnalysisType, string> = {
  themes: `You are a literary analyst helping a fiction writer discover patterns in their work.

Analyze the provided writing entries for thematic connections. Look for:
- Recurring themes and motifs
- Emotional undertones that appear across entries
- Subject matter that the writer gravitates toward
- Philosophical or existential questions being explored

Be specific and cite examples from the entries. Organize your findings clearly.
Keep your analysis insightful but concise (around 300-400 words).`,

  characters: `You are a literary analyst helping a fiction writer discover patterns in their work.

Analyze the provided writing entries for recurring characters and settings. Look for:
- Characters that appear multiple times (even if unnamed, look for similar character types)
- Settings or locations that recur
- Relationship dynamics that repeat
- Character archetypes the writer is drawn to

Be specific and cite examples from the entries. Note any characters or settings that could be developed further.
Keep your analysis insightful but concise (around 300-400 words).`,

  style: `You are a literary analyst helping a fiction writer understand their craft.

Analyze the provided writing entries for stylistic patterns. Look for:
- Distinctive voice characteristics
- Sentence structure tendencies (long/short, simple/complex)
- Use of sensory detail and imagery
- Dialogue patterns and strengths
- Point of view preferences
- Pacing tendencies

Be specific and cite examples. Note both strengths to build on and areas for experimentation.
Keep your analysis insightful but concise (around 300-400 words).`,

  stories: `You are a literary analyst helping a fiction writer find story potential in their work.

Analyze the provided writing entries for potential story connections. Look for:
- Entries that could be combined into a larger narrative
- Characters or situations that could be developed into short stories
- Unfinished threads worth exploring
- Scenes that could serve as story openings or pivotal moments

Be specific about which entries connect and how. Suggest 2-3 concrete story ideas based on the material.
Keep your analysis insightful but concise (around 300-400 words).`,
};

const ANALYSIS_TITLES: Record<AnalysisType, string> = {
  themes: "Thematic Connections",
  characters: "Characters & Settings",
  style: "Stylistic Patterns",
  stories: "Story Threads",
};

export async function analyzeEntries(
  entries: Entry[],
  analysisType: AnalysisType
): Promise<{ title: string; analysis: string }> {
  if (entries.length === 0) {
    return {
      title: ANALYSIS_TITLES[analysisType],
      analysis: "You need some writing entries before patterns can be analyzed. Start writing and come back when you have a few entries!",
    };
  }

  // Format entries for analysis
  const formattedEntries = entries
    .map((entry, index) => {
      const date = new Date(entry.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `--- Entry ${index + 1} (${entry.entry_type}, ${date}) ---\n${entry.entry_text}`;
    })
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: ANALYSIS_PROMPTS[analysisType],
    messages: [
      {
        role: "user",
        content: `Here are my writing entries. Please analyze them:\n\n${formattedEntries}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from API");
  }

  return {
    title: ANALYSIS_TITLES[analysisType],
    analysis: textBlock.text.trim(),
  };
}
