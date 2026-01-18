"use server";

import { chatWithCoach, type CoachMessage } from "./chat";

export async function sendCoachMessage(
  messages: CoachMessage[],
  context: {
    promptText: string;
    currentWriting: string;
    entryType: "daily" | "fiction";
  }
): Promise<{ response?: string; error?: string }> {
  try {
    const response = await chatWithCoach(messages, context);
    return { response };
  } catch (error) {
    console.error("Coach chat error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
