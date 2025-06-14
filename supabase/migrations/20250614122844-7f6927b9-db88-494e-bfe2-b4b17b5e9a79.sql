
-- Create a table for storing quiz sessions
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  total_questions INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for storing individual quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  user_answer CHAR(1) CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz_sessions
CREATE POLICY "Users can view their own quiz sessions" 
  ON public.quiz_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz sessions" 
  ON public.quiz_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
  ON public.quiz_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz sessions" 
  ON public.quiz_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for quiz_questions
CREATE POLICY "Users can view questions from their quiz sessions" 
  ON public.quiz_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE quiz_sessions.id = quiz_questions.quiz_session_id 
      AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for their quiz sessions" 
  ON public.quiz_questions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE quiz_sessions.id = quiz_questions.quiz_session_id 
      AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions from their quiz sessions" 
  ON public.quiz_questions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE quiz_sessions.id = quiz_questions.quiz_session_id 
      AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions from their quiz sessions" 
  ON public.quiz_questions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE quiz_sessions.id = quiz_questions.quiz_session_id 
      AND quiz_sessions.user_id = auth.uid()
    )
  );
