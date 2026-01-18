"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("[signUp] Attempting signup for:", email);

  if (!email || !password) {
    console.log("[signUp] Missing email or password");
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    console.log("[signUp] Password too short");
    return { error: "Password must be at least 6 characters" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("[signUp] Supabase response:", { data, error });

  if (error) {
    console.log("[signUp] Error:", error.message);
    return { error: error.message };
  }

  console.log("[signUp] Success, redirecting...");
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("[signIn] Attempting signin for:", email);

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("[signIn] Supabase response:", { data, error });

  if (error) {
    console.log("[signIn] Error:", error.message);
    return { error: error.message };
  }

  console.log("[signIn] Success, redirecting...");
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
