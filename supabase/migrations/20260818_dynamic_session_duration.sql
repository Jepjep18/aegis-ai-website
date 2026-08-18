-- Add configurable session duration (minutes) to interview sessions.
ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS duration_minutes integer NOT NULL DEFAULT 10;

-- interview_messages had RLS enabled but no policies, which blocks all
-- reads/writes. Add policies scoped through the owning session.
DROP POLICY IF EXISTS "Users can view own interview messages" ON public.interview_messages;
CREATE POLICY "Users can view own interview messages" ON public.interview_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.interview_sessions s
            WHERE s.id = interview_messages.session_id
              AND s.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own interview messages" ON public.interview_messages;
CREATE POLICY "Users can insert own interview messages" ON public.interview_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interview_sessions s
            WHERE s.id = interview_messages.session_id
              AND s.user_id = auth.uid()
        )
    );
