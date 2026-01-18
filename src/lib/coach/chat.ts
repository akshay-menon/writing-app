import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

const COACH_SYSTEM_PROMPT = `You are a curious, supportive writing coach helping a fiction writer during their creative process. Your role is to help them think through their writing by asking thoughtful questions—never by telling them what to write.

Your approach:
- Ask open-ended questions that spark reflection and discovery
- Help the writer notice what's already interesting in their work
- Offer "what if" explorations to open new possibilities
- When they're stuck, help them find their own way forward through questions
- Be warm and encouraging, but not effusive

What you never do:
- Never suggest specific words, sentences, or rewrites
- Never tell them what to write or how to write it
- Never give prescriptive feedback like "you should..." or "try writing..."
- Never be preachy or lecture about craft

Keep your responses concise—usually 1-3 sentences with a question or two. You're a thinking partner, not a teacher delivering lessons.

You have access to:
1. The writing prompt they're working from
2. What they've written so far (if anything)

Use this context to ask relevant, specific questions about their work.`;

export async function chatWithCoach(
  messages: CoachMessage[],
  context: {
    promptText: string;
    currentWriting: string;
    entryType: "daily" | "fiction";
  }
): Promise<string> {
  // Build context message
  const contextInfo = `[Context for this session]
Prompt type: ${context.entryType}
Writing prompt: "${context.promptText}"
${context.currentWriting ? `\nWhat they've written so far:\n---\n${context.currentWriting}\n---` : "\nThey haven't started writing yet."}`;

  // Prepend context to the conversation
  const messagesWithContext: CoachMessage[] = [
    { role: "user", content: contextInfo },
    { role: "assistant", content: "I'm here whenever you'd like to think through your writing. What's on your mind?" },
    ...messages,
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: COACH_SYSTEM_PROMPT,
    messages: messagesWithContext.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from API");
  }

  return textBlock.text.trim();
}
