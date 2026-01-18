"use server";

import { createClient } from "@/lib/supabase/server";
import { analyzeEntries, type AnalysisType } from "./analyze";

export async function runAnalysis(
  analysisType: AnalysisType
): Promise<{ title: string; analysis: string; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      title: "Error",
      analysis: "",
      error: "Not authenticated",
    };
  }

  // Fetch user's entries
  const { data: entries, error: fetchError } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (fetchError) {
    return {
      title: "Error",
      analysis: "",
      error: "Failed to fetch entries",
    };
  }

  try {
    const result = await analyzeEntries(entries || [], analysisType);
    return result;
  } catch (err) {
    console.error("Analysis error:", err);
    return {
      title: "Error",
      analysis: "",
      error: "Failed to analyze entries. Please try again.",
    };
  }
}
