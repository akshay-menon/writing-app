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

  console.log(`[Daily Prompt] Checking for existing prompt for user ${user.id} on ${today}`);

  // Check if prompt exists for today
  const { data: existingPrompt, error: fetchError } = (await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user.id)
    .eq("prompt_type", "daily")
    .eq("generated_date", today)
    .maybeSingle()) as { data: Prompt | null; error: { message?: string } | null };

  if (fetchError) {
    console.error("Error fetching daily prompt:", fetchError);
  }

  if (existingPrompt) {
    console.log(`[Daily Prompt] Found existing prompt (ID: ${existingPrompt.id}), reusing it`);
    return existingPrompt;
  }

  console.log(`[Daily Prompt] No existing prompt found, generating new one...`);

  // Fetch recent prompts to avoid repetition (last 14 days)
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoStr = formatDateForDB(twoWeeksAgo);

  const { data: recentPrompts } = (await supabase
    .from("prompts")
    .select("prompt_text")
    .eq("user_id", user.id)
    .eq("prompt_type", "daily")
    .gte("generated_date", twoWeeksAgoStr)
    .order("generated_date", { ascending: false })) as { data: { prompt_text: string }[] | null };

  const recentPromptTexts = recentPrompts?.map((p) => p.prompt_text) ?? [];
  console.log(`[Daily Prompt] Found ${recentPromptTexts.length} recent prompts to avoid`);

  // Generate new prompt
  try {
    const promptText = await generateDailyPrompt(recentPromptTexts);

    const insertData: PromptInsert = {
      user_id: user.id,
      prompt_text: promptText,
      prompt_type: "daily",
      generated_date: today,
    };

    const { data: newPrompt, error } = (await supabase
      .from("prompts")
      .insert(insertData as never)
      .select()
      .single()) as { data: Prompt | null; error: { code?: string; message?: string } | null };

    if (error) {
      // If duplicate key error, try to fetch the existing prompt
      if (error.code === "23505") {
        console.log(`[Daily Prompt] Race condition detected, fetching existing prompt`);
        const { data: refetchedPrompt } = (await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .eq("prompt_type", "daily")
          .eq("generated_date", today)
          .maybeSingle()) as { data: Prompt | null };
        return refetchedPrompt;
      }
      console.error("Error saving daily prompt:", error);
      return null;
    }

    console.log(`[Daily Prompt] Generated and saved new prompt (ID: ${newPrompt?.id})`);
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

  console.log(`[Weekly Prompt] Checking for existing prompt for user ${user.id} for week of ${saturday}`);

  // Check if prompt exists for this week (keyed by Saturday date)
  const { data: existingPrompt, error: fetchError } = (await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", user.id)
    .eq("prompt_type", "fiction")
    .eq("generated_date", saturday)
    .maybeSingle()) as { data: Prompt | null; error: { message?: string } | null };

  if (fetchError) {
    console.error("Error fetching fiction prompt:", fetchError);
  }

  if (existingPrompt) {
    console.log(`[Weekly Prompt] Found existing prompt (ID: ${existingPrompt.id}), reusing it`);
    return existingPrompt;
  }

  console.log(`[Weekly Prompt] No existing prompt found, generating new one...`);

  // Generate new prompt
  try {
    const promptText = await generateFictionPrompt();

    const insertData: PromptInsert = {
      user_id: user.id,
      prompt_text: promptText,
      prompt_type: "fiction",
      generated_date: saturday,
    };

    const { data: newPrompt, error } = (await supabase
      .from("prompts")
      .insert(insertData as never)
      .select()
      .single()) as { data: Prompt | null; error: { code?: string; message?: string } | null };

    if (error) {
      // If duplicate key error, try to fetch the existing prompt
      if (error.code === "23505") {
        console.log(`[Weekly Prompt] Race condition detected, fetching existing prompt`);
        const { data: refetchedPrompt } = (await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .eq("prompt_type", "fiction")
          .eq("generated_date", saturday)
          .maybeSingle()) as { data: Prompt | null };
        return refetchedPrompt;
      }
      console.error("Error saving fiction prompt:", error);
      return null;
    }

    console.log(`[Weekly Prompt] Generated and saved new prompt (ID: ${newPrompt?.id})`);
    return newPrompt;
  } catch (err) {
    console.error("Error generating fiction prompt:", err);
    return null;
  }
}

export async function getPromptById(promptId: string): Promise<Prompt | null> {
  const supabase = await createClient();

  const { data: prompt } = (await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .maybeSingle()) as { data: Prompt | null };

  return prompt;
}
