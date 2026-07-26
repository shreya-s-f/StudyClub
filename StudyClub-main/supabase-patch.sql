-- =============================================
-- StudyClub — RLS Fix + New Features Patch
-- Run this in Supabase SQL Editor
-- =============================================

-- ── Fix infinite recursion in club_members RLS ──
DROP POLICY IF EXISTS "Members can read club members" ON public.club_members;
DROP POLICY IF EXISTS "Users can join clubs" ON public.club_members;
DROP POLICY IF EXISTS "Users can leave clubs" ON public.club_members;
DROP POLICY IF EXISTS "Read own memberships" ON public.club_members;
DROP POLICY IF EXISTS "Join clubs" ON public.club_members;
DROP POLICY IF EXISTS "Leave clubs" ON public.club_members;

-- Safe non-recursive policies
CREATE POLICY "club_members_select" ON public.club_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "club_members_insert" ON public.club_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "club_members_delete" ON public.club_members
  FOR DELETE USING (user_id = auth.uid());

-- ── Fix clubs policy (also recursive) ──
DROP POLICY IF EXISTS "Club members can read clubs" ON public.clubs;
DROP POLICY IF EXISTS "Authenticated users can create clubs" ON public.clubs;
DROP POLICY IF EXISTS "Owners can update clubs" ON public.clubs;
DROP POLICY IF EXISTS "Owners can delete clubs" ON public.clubs;

CREATE POLICY "clubs_select" ON public.clubs
  FOR SELECT USING (
    owner_id = auth.uid()
    OR id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid())
  );

CREATE POLICY "clubs_insert" ON public.clubs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "clubs_update" ON public.clubs
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "clubs_delete" ON public.clubs
  FOR DELETE USING (owner_id = auth.uid());

-- ── Fix tasks RLS ──
DROP POLICY IF EXISTS "Users manage own tasks" ON public.tasks;

CREATE POLICY "tasks_all" ON public.tasks
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Fix leaderboard RLS ──
DROP POLICY IF EXISTS "Club members can read leaderboard" ON public.leaderboard_stats;
DROP POLICY IF EXISTS "Users manage own leaderboard stats" ON public.leaderboard_stats;
DROP POLICY IF EXISTS "Users update own leaderboard stats" ON public.leaderboard_stats;

CREATE POLICY "leaderboard_select" ON public.leaderboard_stats
  FOR SELECT USING (
    user_id = auth.uid()
    OR club_id IN (SELECT club_id FROM public.club_members WHERE user_id = auth.uid())
  );

CREATE POLICY "leaderboard_insert" ON public.leaderboard_stats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "leaderboard_update" ON public.leaderboard_stats
  FOR UPDATE USING (user_id = auth.uid());

-- ── Calendar Events table ──
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  type TEXT DEFAULT 'study' CHECK (type IN ('study', 'exam', 'class', 'reminder')),
  color TEXT DEFAULT 'accent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calendar_all" ON public.calendar_events
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Fix notes RLS ──
DROP POLICY IF EXISTS "Users manage own notes" ON public.notes;

CREATE POLICY "notes_all" ON public.notes
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Fix flashcards RLS ──
DROP POLICY IF EXISTS "Users manage own flashcards" ON public.flashcards;

CREATE POLICY "flashcards_all" ON public.flashcards
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Fix pomodoro RLS ──
DROP POLICY IF EXISTS "Users manage own pomodoros" ON public.pomodoro_sessions;

CREATE POLICY "pomodoro_all" ON public.pomodoro_sessions
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Enable realtime for calendar ──
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
