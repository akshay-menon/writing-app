# Project: Writing Practice App

## Overview
Personal fiction writing practice app for building consistent writing habits. Combines AI-powered prompt generation with writing storage, pattern analysis, and real-time coaching.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth with RLS)
- **AI**: Anthropic Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Deployment**: Vercel

## Key Directories
```
src/
├── app/(main)/          # Main pages: home, write, archive, patterns
├── app/(auth)/          # Login/signup pages
├── components/          # Navigation, CoachPanel
├── lib/
│   ├── auth/            # Sign up, sign in, sign out actions
│   ├── entries/         # Entry CRUD operations
│   ├── prompts/         # Prompt generation & caching
│   ├── analysis/        # Pattern analysis with Claude
│   ├── coach/           # Writing coach chat logic
│   └── supabase/        # Client, server, middleware setup
└── types/database.ts    # Supabase type definitions
```

## Database Schema (supabase/schema.sql)
- `users` - Profiles linked to Supabase Auth
- `prompts` - Daily/fiction prompts, cached by (user_id, type, date)
- `entries` - Writing entries linked to prompts

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Architecture Notes
- Server Components + Server Actions for data fetching
- Prompts cached in Supabase by date to avoid redundant API calls
- Row-level security (RLS) policies protect all user data
- CoachPanel uses localStorage for session chat history
- Archive filtering happens client-side for responsiveness
- Export (Markdown/JSON) runs entirely client-side

## Features
1. **Home** (`/`) - Shows daily prompt + weekly fiction prompt (Saturdays)
2. **Write** (`/write`) - Distraction-free writing with word count, auto-save
3. **Coach** (side panel) - AI asks reflective questions during writing
4. **Archive** (`/archive`) - View, filter, edit, delete, export entries
5. **Patterns** (`/patterns`) - AI analyzes themes, characters, style, story threads

## Prompt Philosophy
- **Daily prompts**: Quick 5-minute noticing exercises focused on concrete details (what you saw, heard, felt). Simple and direct, not craft-focused.
- **Weekly fiction prompts**: Longer-form story starters generated on Saturdays.
- Prompts are cached by date in Supabase. To force regenerate, delete the row from the `prompts` table.
- **Variety mechanism**: When generating a new daily prompt, the system fetches the last 14 days of prompts and includes them in the API call so Claude avoids similar topics. The system prompt also lists diverse sensory categories (sounds, textures, smells, movement, spaces, people, objects, time, weather) to encourage variety.
