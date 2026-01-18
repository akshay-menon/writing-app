"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Entry, EntryType } from "@/types/database";

export async function saveEntry(
  entryText: string,
  entryType: EntryType,
  promptId?: string
): Promise<{ entry: Entry | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { entry: null, error: "Not authenticated" };
  }

  const { data: entry, error } = await supabase
    .from("entries")
    .insert({
      user_id: user.id,
      entry_text: entryText,
      entry_type: entryType,
      prompt_id: promptId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving entry:", error);
    return { entry: null, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/archive");

  return { entry, error: null };
}

export async function updateEntry(
  entryId: string,
  entryText: string
): Promise<{ entry: Entry | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { entry: null, error: "Not authenticated" };
  }

  const { data: entry, error } = await supabase
    .from("entries")
    .update({ entry_text: entryText })
    .eq("id", entryId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating entry:", error);
    return { entry: null, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/archive");

  return { entry, error: null };
}

export async function getEntries(): Promise<Entry[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return entries || [];
}

export async function getEntryById(entryId: string): Promise<Entry | null> {
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", entryId)
    .single();

  return entry;
}

export async function deleteEntry(
  entryId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting entry:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/archive");

  return { success: true, error: null };
}

export type EntryFilters = {
  type?: "all" | "daily" | "fiction";
  dateFrom?: string;
  dateTo?: string;
};

export async function getEntriesWithFilters(filters: EntryFilters): Promise<Entry[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  let query = supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filters.type && filters.type !== "all") {
    query = query.eq("entry_type", filters.type);
  }

  if (filters.dateFrom) {
    query = query.gte("created_at", filters.dateFrom);
  }

  if (filters.dateTo) {
    // Add one day to include the end date fully
    const endDate = new Date(filters.dateTo);
    endDate.setDate(endDate.getDate() + 1);
    query = query.lt("created_at", endDate.toISOString());
  }

  const { data: entries } = await query;

  return entries || [];
}
