-- =============================================
-- StudyClub — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────
-- USERS (mirrors Supabase Auth, stores display info)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────
-- CLUBS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────
-- CLUB MEMBERS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.club_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'mod', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- ──────────────────────────────────────────────────────────
-- TASKS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────
-- POMODORO SESSIONS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────
-- NOTES
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'pdf', 'link')),
  title TEXT,
  content TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────
-- FLASHCARDS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────
-- LEADERBOARD STATS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leaderboard_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  total_hours NUMERIC(10, 2) DEFAULT 0,
  pomodoros_completed INTEGER DEFAULT 0,
  quiz_score NUMERIC(5, 2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, club_id)
);

-- ──────────────────────────────────────────────────────────
-- STUDY SESSIONS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  started_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  room_link TEXT,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ
);

-- ──────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Users: read all, write own
CREATE POLICY "Users can read all profiles" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Clubs: members can read, anyone can insert, owners can delete
CREATE POLICY "Club members can read clubs" ON public.clubs FOR SELECT
  USING (id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid()));
CREATE POLICY "Authenticated users can create clubs" ON public.clubs FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update clubs" ON public.clubs FOR UPDATE
  USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete clubs" ON public.clubs FOR DELETE
  USING (auth.uid() = owner_id);

-- Club members: read if member, insert own membership
CREATE POLICY "Members can read club members" ON public.club_members FOR SELECT
  USING (club_id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can join clubs" ON public.club_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave clubs" ON public.club_members FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks: own tasks + club tasks for club members
CREATE POLICY "Users manage own tasks" ON public.tasks FOR ALL
  USING (auth.uid() = user_id);

-- Pomodoro: own data only
CREATE POLICY "Users manage own pomodoros" ON public.pomodoro_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Notes: own data
CREATE POLICY "Users manage own notes" ON public.notes FOR ALL
  USING (auth.uid() = user_id);

-- Flashcards: own data
CREATE POLICY "Users manage own flashcards" ON public.flashcards FOR ALL
  USING (auth.uid() = user_id);

-- Leaderboard: club members can read, authenticated can write own
CREATE POLICY "Club members can read leaderboard" ON public.leaderboard_stats FOR SELECT
  USING (club_id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid()));
CREATE POLICY "Users manage own leaderboard stats" ON public.leaderboard_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own leaderboard stats" ON public.leaderboard_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Study sessions: club members can read and create
CREATE POLICY "Club members can read study sessions" ON public.study_sessions FOR SELECT
  USING (club_id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid()));
CREATE POLICY "Club members can create study sessions" ON public.study_sessions FOR INSERT
  WITH CHECK (club_id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid()));

-- ──────────────────────────────────────────────────────────
-- REALTIME
-- Enable realtime for collaborative tables
-- ──────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
