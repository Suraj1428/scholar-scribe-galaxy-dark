import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  user_answer?: string;
  is_correct?: boolean;
}

export interface QuizSession {
  id: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  score: number;
  completed: boolean;
  created_at: string;
}

export const useQuiz = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const generateQuiz = useMutation({
    mutationFn: async ({ topic, difficulty = 'medium', questionCount = 5 }: {
      topic: string;
      difficulty?: string;
      questionCount?: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic, difficulty, questionCount }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Quiz generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['quiz-sessions'] });
    },
    onError: (error: any) => {
      toast.error('Failed to generate quiz: ' + error.message);
    }
  });

  const createQuizFromJSON = useMutation({
    mutationFn: async ({ topic, difficulty = 'medium', questions }: {
      topic: string;
      difficulty?: string;
      questions: any[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Create quiz session
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user.id,
          topic,
          difficulty,
          total_questions: questions.length
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Insert questions
      const questionsToInsert = questions.map((q: any) => ({
        quiz_session_id: session.id,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      return { session_id: session.id, questions: questions.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-sessions'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create quiz: ' + error.message);
    }
  });

  const getQuizSessions = useQuery({
    queryKey: ['quiz-sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuizSession[];
    },
    enabled: !!user
  });

  const getQuizQuestions = (sessionId: string) => useQuery({
    queryKey: ['quiz-questions', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_session_id', sessionId)
        .order('created_at');
      
      if (error) throw error;
      return data as QuizQuestion[];
    },
    enabled: !!sessionId
  });

  const submitAnswer = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      const { data: question } = await supabase
        .from('quiz_questions')
        .select('correct_answer')
        .eq('id', questionId)
        .single();

      const isCorrect = question?.correct_answer === answer;

      const { error } = await supabase
        .from('quiz_questions')
        .update({
          user_answer: answer,
          is_correct: isCorrect
        })
        .eq('id', questionId);

      if (error) throw error;
      return { isCorrect };
    },
    onError: (error: any) => {
      toast.error('Failed to submit answer: ' + error.message);
    }
  });

  const completeQuiz = useMutation({
    mutationFn: async (sessionId: string) => {
      // Calculate score
      const { data: questions } = await supabase
        .from('quiz_questions')
        .select('is_correct')
        .eq('quiz_session_id', sessionId);

      const score = questions?.filter(q => q.is_correct).length || 0;

      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          score,
          completed: true
        })
        .eq('id', sessionId);

      if (error) throw error;
      return { score, total: questions?.length || 0 };
    },
    onSuccess: (data) => {
      toast.success(`Quiz completed! Score: ${data.score}/${data.total}`);
      queryClient.invalidateQueries({ queryKey: ['quiz-sessions'] });
    }
  });

  return {
    generateQuiz,
    createQuizFromJSON,
    getQuizSessions,
    getQuizQuestions,
    submitAnswer,
    completeQuiz,
    isGenerating: generateQuiz.isPending
  };
};
