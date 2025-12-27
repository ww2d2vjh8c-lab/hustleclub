# HustleClub

A comprehensive creator platform built with Next.js 14, featuring courses, UGC clipping jobs, and thrift marketplace functionality.

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account and project

### Database Setup

**⚠️ IMPORTANT: You must complete this step before the app will work!**

The app requires a Supabase database with specific tables and RLS policies. Follow these steps:

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned

#### Step 2: Run Database Schema
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy the **entire contents** of `database-schema.sql`
5. Paste into the SQL Editor
6. Click **"RUN"** (or press Ctrl+Enter)

#### Step 3: Verify Setup
1. Go to **Table Editor** in Supabase dashboard
2. Confirm these tables exist:
   - `profiles`
   - `courses`
   - `clipping_jobs` ✅ (fixes the current error)
   - `thrift_items`

#### Step 4: Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

#### Quick Setup Helper
Run this command for detailed instructions:
```bash
./setup-database.sh
```

**Expected Result:**
- ✅ No "Could not find the table public.clipping_jobs" errors
- ✅ `/clipping` page loads correctly
- ✅ Empty state shows if no jobs exist

**Alternative: Using Supabase CLI** (optional)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

### Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Authentication**: Supabase Auth integration
- **Courses**: Create and manage educational content
- **UGC Clipping**: Post and browse clipping job opportunities
- **Thrift Marketplace**: Buy and sell digital products
- **Dashboard**: Centralized management interface

## Database Schema

The application uses the following tables:

- `profiles` - User profile information
- `courses` - Educational content
- `clipping_jobs` - UGC clipping opportunities
- `thrift_items` - Marketplace listings

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
