"use server";

import { createClient } from "@/lib/supabase/server";
import { generateDailyPrompt, generateFictionPrompt } from "./generate";
import { formatDateForDB, getCurrentWeekSaturday, getTodayDate } from "@/lib/dates";
import type { Prompt, PromptInsert } from "@/types/database";

export async function getDailyPrompt(): Promise<Prompt | null> {
  const supabase = await createClient();
  const today = formatDateForDB(getTodayDate());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Check if prompt exists for today
  const { data: existingPrompt, error: fetchError } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user.id)
    .eq("prompt_type", "daily")
    .eq("generated_date", today)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching daily prompt:", fetchError);
  }

  if (existingPrompt) {
    return existingPrompt;
  }

  // Generate new prompt
  try {
    const promptText = await generateDailyPrompt();

    const insertData: PromptInsert = {
      user_id: user.id,
      prompt_text: promptText,
      prompt_type: "daily",
      generated_date: today,
    };

    const { data: newPrompt, error } = await supabase
      .from("prompts")
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      // If duplicate key error, try to fetch the existing prompt
      if (error.code === "23505") {
        const { data: refetchedPrompt } = await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .eq("prompt_type", "daily")
          .eq("generated_date", today)
          .maybeSingle();
        return refetchedPrompt;
      }
      console.error("Error saving daily prompt:", error);
      return null;
    }

    return newPrompt;
  } catch (err) {
    console.error("Error generating daily prompt:", err);
    return null;
  }
}

export async function getWeeklyFictionPrompt(): Promise<Prompt | null> {
  const supabase = await createClient();
  const saturday = formatDateForDB(getCurrentWeekSaturday());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Check if prompt exists for this week (keyed by Saturday date)
  const { data: existingPrompt, error: fetchError } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user.id)
    .eq("prompt_type", "fiction")
    .eq("generated_date", saturday)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching fiction prompt:", fetchError);
  }

  if (existingPrompt) {
    return existingPrompt;
  }

  // Generate new prompt
  try {
    const promptText = await generateFictionPrompt();

    const insertData: PromptInsert = {
      user_id: user.id,
      prompt_text: promptText,
      prompt_type: "fiction",
      generated_date: saturday,
    };

    const { data: newPrompt, error } = await supabase
      .from("prompts")
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      // If duplicate key error, try to fetch the existing prompt
      if (error.code === "23505") {
        const { data: refetchedPrompt } = await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .eq("prompt_type", "fiction")
          .eq("generated_date", saturday)
          .maybeSingle();
        return refetchedPrompt;
      }
      console.error("Error saving fiction prompt:", error);
      return null;
    }

    return newPrompt;
  } catch (err) {
    console.error("Error generating fiction prompt:", err);
    return null;
  }
}

export async function getPromptById(promptId: string): Promise<Prompt | null> {
  const supabase = await createClient();

  const { data: prompt } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .maybeSingle();

  return prompt;
}
