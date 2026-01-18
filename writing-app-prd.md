# Product Requirements Document: Fiction Writing Practice App

## 1. Project Overview

### 1.1 Purpose
Build a personal writing practice tool that supports consistent fiction writing habit development. The app serves as both a creative practice platform and a repository for building a collection of writing over time.

### 1.2 User
Single user (Akshay) — personal tool with potential for future expansion to other users.

### 1.3 Context
- User completed a fiction writing course in autumn 2024
- Goal: Establish sustainable writing practice leading to writing a fiction book later in 2025
- Success metric: Consistent usage that develops craft while generating material that could connect into short stories

## 2. Core Goals

1. **Establish writing habit**: Provide structure for regular fiction writing practice (weekly) and daily creative thinking
2. **Build a collection**: Centralized repository of all writing that accumulates over time
3. **Develop craft**: Prompts focused on specific writing craft elements rather than surface-level journaling
4. **Discover patterns**: Ability to analyze writing for emerging themes, characters, stylistic elements, and potential story connections
5. **Maintain flexibility**: Avoid guilt-inducing structures; support sustainable long-term practice

## 3. MVP Scope

### 3.1 Core Features (Must Have)

#### 3.1.1 Prompt System
- **Daily creative prompts**: Generated fresh each day by LLM
  - Focus on specific craft elements (dialogue, sensory detail, perspective, etc.)
  - Reflective/observational but intentional (not surface-level "what I did today")
  - User can skip days without penalty or guilt
  
- **Weekly fiction prompts**: Generated every Saturday by LLM
  - Designed to potentially connect into short stories
  - Prompts should build story elements (character studies, settings, conflicts)
  - Open-ended with no length or time constraints

#### 3.1.2 Writing Interface
- Simple, distraction-free writing area
- Displays the current prompt
- Auto-saves entries to cloud storage
- No word count pressure or time limits
- Ability to edit and revise entries after initial save

#### 3.1.3 Storage & Data
- Cloud-based storage (Supabase) for multi-device access
- Each entry stores:
  - Text content
  - Associated prompt
  - Date created
  - Entry type (daily/fiction)
  - Last modified date

#### 3.1.4 Archive View
- Unified chronological view showing:
  - All prompts generated (daily + weekly fiction)
  - Entries written in response to prompts
  - Prompts without responses (skipped days visible)
- Filter by type: All / Daily / Fiction
- Filter by status: All / Entries only / Prompts only / Unanswered prompts
- Filter by date range
- View and edit past entries
- Export functionality:
  - Single entry export as .txt or .md
  - Bulk export (filtered selection or all entries)
  - Export as individual files (zip) or combined markdown
  - Option to export prompts history alongside entries

#### 3.1.5 Patterns Section
- Interface to request LLM analysis of writing collection
- Analysis types:
  - Thematic connections
  - Recurring characters/settings
  - Stylistic patterns
  - Potential story threads
- Display analysis results in readable format

#### 3.1.6 Home Page
- Shows current daily prompt (refreshes daily)
- Shows current fiction prompt (displays on Saturdays)
- Quick access to start writing for either prompt
- Recent entries preview (optional)

### 3.2 Technical Architecture

#### Tech Stack
- **Frontend**: React with Next.js
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **LLM**: Anthropic API (Claude) for prompt generation and pattern analysis
- **Deployment**: Vercel
- **Authentication**: Supabase Auth (email/password)

#### Database Schema (Initial)
```
users
- id (uuid, primary key)
- email (text)
- created_at (timestamp)

prompts
- id (uuid, primary key)
- user_id (uuid, foreign key)
- prompt_text (text)
- prompt_type (enum: 'daily' | 'fiction')
- generated_date (date)
- created_at (timestamp)

entries
- id (uuid, primary key)
- user_id (uuid, foreign key)
- prompt_id (uuid, foreign key, nullable)
- entry_text (text)
- entry_type (enum: 'daily' | 'fiction')
- created_at (timestamp)
- updated_at (timestamp)
```

#### API Integration Points
- Anthropic API for:
  - Daily prompt generation (minimal context)
  - Weekly fiction prompt generation (minimal context)
  - Pattern analysis (passes collection of entries as context)

### 3.3 Out of Scope (For MVP)

The following features are explicitly deferred to post-MVP iterations:
- Multi-user support
- Prompt customization/preferences
- Writing streaks or statistics
- Social/sharing features
- Mobile native apps (web-responsive is sufficient)
- Advanced text formatting (rich text editor)
- Prompt history/regeneration
- Writing goals or targets
- Reminders/notifications
- Tags or categories beyond daily/fiction
- Search functionality within entries
- Version history for entries
- Integration with other writing tools

## 4. User Flows

### 4.1 First Time Setup
1. User visits app URL
2. Signs up with email/password via Supabase Auth
3. Redirected to home page with today's prompts

### 4.2 Daily Writing Session
1. User logs in and sees home page
2. Views current daily prompt (or Saturday fiction prompt)
3. Clicks to start writing
4. Writes response (no time/length constraints)
5. Saves entry to Supabase
6. Entry appears in archive

### 4.3 Reviewing Past Writing
1. User navigates to archive
2. Browses/filters entries
3. Opens entry to read or edit
4. Optionally exports selected entries

### 4.4 Finding Patterns
1. User navigates to patterns section
2. Requests analysis (e.g., "find recurring themes in my fiction writing")
3. LLM analyzes relevant entries
4. Results displayed for user to review

## 5. Success Criteria (MVP)

The MVP is successful if:
1. User can consistently access fresh prompts (daily + weekly)
2. All writing is reliably saved and accessible across devices
3. User can export their writing in standard formats (not locked in)
4. User can request and receive meaningful pattern analysis
5. The system feels simple enough to use regularly without friction

## 6. Development Phases

### Phase 1: Foundation
- Set up Next.js project
- Configure Supabase (database + auth)
- Implement basic authentication flow
- Create database schema

### Phase 2: Core Writing Flow
- Build home page with prompt display
- Integrate Anthropic API for prompt generation
- Create writing interface
- Implement save to Supabase
- Basic archive view (list entries)

### Phase 3: Archive & Export
- Enhanced archive with filters
- Entry viewing and editing
- Export functionality (single and bulk)

### Phase 4: Patterns Analysis
- Create patterns section UI
- Implement LLM analysis integration
- Display analysis results

### Phase 5: Polish & Deploy
- Responsive design improvements
- Error handling and loading states
- Deploy to Vercel
- Test multi-device access

## 7. Design Principles

1. **Simplicity first**: Every feature should feel effortless to use
2. **No guilt**: Skip days, flexible practice, no streaks or pressure
3. **Data ownership**: User can export everything in standard formats
4. **Craft-focused**: Prompts target skill development, not busy work
5. **Iterative improvement**: Start minimal, add complexity based on real usage

## 8. Open Questions & Future Considerations

To be determined through usage:
- Optimal prompt generation strategy (fully random vs. some progression)
- How often to run pattern analysis (manual only vs. periodic suggestions)
- Whether to add prompt regeneration if user dislikes current prompt
- Mobile app necessity vs. responsive web sufficiency
- Community/sharing features if expanded to other users

---

## Appendix: Technical Notes

### Anthropic API Usage
- Prompt generation requires minimal context (just prompt type and date)
- Pattern analysis will pass filtered entries as context (consider token limits for large collections)
- Use streaming for pattern analysis to show progressive results

### Export Format Examples
**Single entry (.md)**:
```
# [Entry Type] - [Date]

## Prompt
[Prompt text]

## Response
[Entry text]
```

**Bulk export**: Zip file containing individual markdown files or single combined markdown with entries separated by headers.

### Data Portability
All user writing must be exportable in plain text formats (.txt, .md) to ensure the user is never locked into this platform. This is a core requirement, not a nice-to-have.
