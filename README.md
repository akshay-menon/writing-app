# Writing Practice App

A personal fiction writing practice app designed to build consistent writing habits through daily prompts, AI-powered coaching, and pattern analysis.

## Features

- **Daily Prompts** - AI-generated prompts focused on observation and noticing moments from everyday life
- **Weekly Fiction Prompts** - Story-sparking prompts generated every Saturday for longer-form writing
- **Distraction-Free Writing** - Clean writing interface with word count and auto-save
- **Writing Coach** - AI-powered side panel that asks reflective questions during writing sessions
- **Archive** - Browse, filter, edit, and export your writing entries as Markdown or JSON
- **Pattern Analysis** - AI analyzes your writing to surface themes, recurring characters, stylistic patterns, and potential story threads

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Anthropic Claude Sonnet 4
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Anthropic API key

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/writing-app.git
   cd writing-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `ANTHROPIC_API_KEY` - Your Anthropic API key

4. Set up the database

   Run the SQL in `supabase/schema.sql` in your Supabase SQL editor to create the required tables and policies.

5. Start the development server
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to use the app.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
