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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Prompt = Database["public"]["Tables"]["prompts"]["Row"];
export type Entry = Database["public"]["Tables"]["entries"]["Row"];

// Insert types
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"];
export type EntryInsert = Database["public"]["Tables"]["entries"]["Insert"];

// Update types
export type EntryUpdate = Database["public"]["Tables"]["entries"]["Update"];
