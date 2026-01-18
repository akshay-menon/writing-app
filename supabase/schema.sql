-- Writing App Database Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type prompt_type as enum ('daily', 'fiction');
create type entry_type as enum ('daily', 'fiction');

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prompts table
create table public.prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  prompt_text text not null,
  prompt_type prompt_type not null,
  generated_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Ensure one prompt per type per day per user
  unique(user_id, prompt_type, generated_date)
);

-- Entries table
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  prompt_id uuid references public.prompts on delete set null,
  entry_text text not null,
  entry_type entry_type not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for common queries
create index prompts_user_id_idx on public.prompts(user_id);
create index prompts_generated_date_idx on public.prompts(generated_date);
create index prompts_user_date_type_idx on public.prompts(user_id, generated_date, prompt_type);
create index entries_user_id_idx on public.entries(user_id);
create index entries_prompt_id_idx on public.entries(prompt_id);
create index entries_created_at_idx on public.entries(created_at);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.prompts enable row level security;
alter table public.entries enable row level security;

-- RLS Policies for users table
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- RLS Policies for prompts table
create policy "Users can view own prompts"
  on public.prompts for select
  using (auth.uid() = user_id);

create policy "Users can insert own prompts"
  on public.prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own prompts"
  on public.prompts for update
  using (auth.uid() = user_id);

create policy "Users can delete own prompts"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- RLS Policies for entries table
create policy "Users can view own entries"
  on public.entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for entries updated_at
create trigger entries_updated_at
  before update on public.entries
  for each row execute procedure public.handle_updated_at();
