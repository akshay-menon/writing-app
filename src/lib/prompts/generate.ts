import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DAILY_PROMPT_SYSTEM = `You are a creative writing coach helping a fiction writer develop their craft through daily practice.

Generate a single writing prompt that:
- Focuses on a specific craft element (dialogue, sensory detail, perspective, character voice, setting, tension, etc.)
- Is reflective or observational but intentionally craft-focused
- Can be completed in 10-30 minutes
- Encourages noticing and capturing details from life that could feed into fiction

Keep the prompt to 2-3 sentences. Be specific enough to spark ideas but open enough for personal interpretation.

Do NOT include any preamble or explanation. Just output the prompt itself.`;

const FICTION_PROMPT_SYSTEM = `You are a creative writing coach helping a fiction writer build material for short stories.

Generate a single fiction writing prompt that:
- Could develop into a short story or become part of one
- Focuses on story elements: character studies, compelling settings, interesting conflicts, pivotal moments
- Is open-ended with no length constraints
- Sparks imagination while leaving room for the writer's own direction

Keep the prompt to 2-4 sentences. Create something that excites the imagination.

Do NOT include any preamble or explanation. Just output the prompt itself.`;

export async function generateDailyPrompt(): Promise<string> {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: DAILY_PROMPT_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Generate a daily writing prompt for ${today}. Focus on a craft element that would be valuable to practice.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from API");
  }

  return textBlock.text.trim();
}

export async function generateFictionPrompt(): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system: FICTION_PROMPT_SYSTEM,
    messages: [
      {
        role: "user",
        content: "Generate a weekly fiction writing prompt that could inspire a short story.",
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from API");
  }

  return textBlock.text.trim();
}
