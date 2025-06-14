
-- Create table for challenge sessions (different from individual quiz sessions)
CREATE TABLE public.challenge_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  total_questions INTEGER NOT NULL,
  time_limit INTEGER DEFAULT 30, -- seconds per question
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days')
);

-- Create table for challenge questions (copied from original quiz)
CREATE TABLE public.challenge_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_session_id UUID REFERENCES public.challenge_sessions(id) ON DELETE CASCADE NOT NULL,
  question_order INTEGER NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for challenge participants and their results
CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_session_id UUID REFERENCES public.challenge_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users,
  participant_name TEXT NOT NULL, -- for anonymous users
  score INTEGER DEFAULT 0,
  total_time INTEGER DEFAULT 0, -- total time taken in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_session_id, user_id)
);

-- Create table for individual challenge answers
CREATE TABLE public.challenge_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.challenge_participants(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.challenge_questions(id) ON DELETE CASCADE NOT NULL,
  user_answer CHAR(1) CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN DEFAULT false,
  time_taken INTEGER DEFAULT 0, -- seconds taken for this question
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant_id, question_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.challenge_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_answers ENABLE ROW LEVEL SECURITY;

-- Policies for challenge_sessions
CREATE POLICY "Anyone can view active challenge sessions" 
  ON public.challenge_sessions 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can create challenge sessions" 
  ON public.challenge_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their challenge sessions" 
  ON public.challenge_sessions 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Policies for challenge_questions
CREATE POLICY "Anyone can view questions from active challenges" 
  ON public.challenge_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.challenge_sessions 
      WHERE challenge_sessions.id = challenge_questions.challenge_session_id 
      AND challenge_sessions.is_active = true
    )
  );

CREATE POLICY "Challenge creators can insert questions" 
  ON public.challenge_questions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.challenge_sessions 
      WHERE challenge_sessions.id = challenge_questions.challenge_session_id 
      AND challenge_sessions.creator_id = auth.uid()
    )
  );

-- Policies for challenge_participants
CREATE POLICY "Anyone can view challenge participants" 
  ON public.challenge_participants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.challenge_sessions 
      WHERE challenge_sessions.id = challenge_participants.challenge_session_id 
      AND challenge_sessions.is_active = true
    )
  );

CREATE POLICY "Anyone can join challenges" 
  ON public.challenge_participants 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.challenge_sessions 
      WHERE challenge_sessions.id = challenge_participants.challenge_session_id 
      AND challenge_sessions.is_active = true
    )
  );

CREATE POLICY "Participants can update their own records" 
  ON public.challenge_participants 
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.uid() IS NULL)
  );

-- Policies for challenge_answers
CREATE POLICY "Anyone can view answers from active challenges" 
  ON public.challenge_answers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.challenge_participants cp
      JOIN public.challenge_sessions cs ON cp.challenge_session_id = cs.id
      WHERE cp.id = challenge_answers.participant_id 
      AND cs.is_active = true
    )
  );

CREATE POLICY "Participants can insert their own answers" 
  ON public.challenge_answers 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.challenge_participants cp
      WHERE cp.id = challenge_answers.participant_id 
      AND (cp.user_id = auth.uid() OR (cp.user_id IS NULL AND auth.uid() IS NULL))
    )
  );
