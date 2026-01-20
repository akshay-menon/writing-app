import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DAILY_PROMPT_SYSTEM = `You are helping a fiction writer build a daily habit of noticing small moments.

Generate a single writing prompt that:
- Points to something specific they might have noticed in their day
- Can be answered in a few sentences or a short paragraph (5 minutes)
- Is about capturing the moment, not analyzing or crafting it into prose
- Focuses on concrete details: what they saw, heard, felt, or noticed

Keep the prompt to one sentence. Make it simple and direct—like a friend asking "what did you notice today?"

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
        content: `Generate a daily noticing prompt for ${today}.`,
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
