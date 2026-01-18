export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PromptType = "daily" | "fiction";
export type EntryType = "daily" | "fiction";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      prompts: {
        Row: {
          id: string;
          user_id: string;
          prompt_text: string;
          prompt_type: PromptType;
          generated_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt_text: string;
          prompt_type: PromptType;
          generated_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt_text?: string;
          prompt_type?: PromptType;
          generated_date?: string;
          created_at?: string;
        };
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          prompt_id: string | null;
          entry_text: string;
          entry_type: EntryType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt_id?: string | null;
          entry_text: string;
          entry_type: EntryType;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt_id?: string | null;
          entry_text?: string;
          entry_type?: EntryType;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      prompt_type: PromptType;
      entry_type: EntryType;
    };
  };
}

// Convenience types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Prompt = Database["public"]["Tables"]["prompts"]["Row"];
export type Entry = Database["public"]["Tables"]["entries"]["Row"];
