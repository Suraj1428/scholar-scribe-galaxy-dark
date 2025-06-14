
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ChallengeSession {
  id: string;
  creator_id: string;
  title: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  time_limit: number;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

export interface ChallengeQuestion {
  id: string;
  challenge_session_id: string;
  question_order: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_session_id: string;
  user_id: string | null;
  participant_name: string;
  score: number;
  total_time: number;
  completed_at: string | null;
  created_at: string;
}

export const useChallenge = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createChallenge = useMutation({
    mutationFn: async ({ title, topic, difficulty = 'medium', questions }: {
      title: string;
      topic: string;
      difficulty?: string;
      questions: any[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Create challenge session
      const { data: session, error: sessionError } = await supabase
        .from('challenge_sessions')
        .insert({
          creator_id: user.id,
          title,
          topic,
          difficulty,
          total_questions: questions.length,
          time_limit: 30
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Insert questions
      const questionsToInsert = questions.map((q: any, index: number) => ({
        challenge_session_id: session.id,
        question_order: index + 1,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer
      }));

      const { error: questionsError } = await supabase
        .from('challenge_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      return session;
    },
    onSuccess: () => {
      toast.success('Challenge created successfully!');
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create challenge: ' + error.message);
    }
  });

  const getChallengeByLink = (challengeId: string) => useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_sessions')
        .select('*')
        .eq('id', challengeId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as ChallengeSession;
    },
    enabled: !!challengeId
  });

  const getChallengeQuestions = (challengeId: string) => useQuery({
    queryKey: ['challenge-questions', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_questions')
        .select('*')
        .eq('challenge_session_id', challengeId)
        .order('question_order');
      
      if (error) throw error;
      return data as ChallengeQuestion[];
    },
    enabled: !!challengeId
  });

  const getChallengeLeaderboard = (challengeId: string) => useQuery({
    queryKey: ['challenge-leaderboard', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('challenge_session_id', challengeId)
        .order('score', { ascending: false })
        .order('total_time', { ascending: true });
      
      if (error) throw error;
      return data as ChallengeParticipant[];
    },
    enabled: !!challengeId
  });

  const joinChallenge = useMutation({
    mutationFn: async ({ challengeId, participantName }: {
      challengeId: string;
      participantName: string;
    }) => {
      const { data, error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_session_id: challengeId,
          user_id: user?.id || null,
          participant_name: participantName
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge-leaderboard'] });
    },
    onError: (error: any) => {
      toast.error('Failed to join challenge: ' + error.message);
    }
  });

  const submitChallengeAnswer = useMutation({
    mutationFn: async ({ participantId, questionId, answer, timeTaken }: {
      participantId: string;
      questionId: string;
      answer: string;
      timeTaken: number;
    }) => {
      const { data: question } = await supabase
        .from('challenge_questions')
        .select('correct_answer')
        .eq('id', questionId)
        .single();

      const isCorrect = question?.correct_answer === answer;

      const { error } = await supabase
        .from('challenge_answers')
        .insert({
          participant_id: participantId,
          question_id: questionId,
          user_answer: answer,
          is_correct: isCorrect,
          time_taken: timeTaken
        });

      if (error) throw error;
      return { isCorrect };
    }
  });

  const completeChallenge = useMutation({
    mutationFn: async (participantId: string) => {
      // Calculate score and total time
      const { data: answers } = await supabase
        .from('challenge_answers')
        .select('is_correct, time_taken')
        .eq('participant_id', participantId);

      const score = answers?.filter(a => a.is_correct).length || 0;
      const totalTime = answers?.reduce((sum, a) => sum + (a.time_taken || 0), 0) || 0;

      const { error } = await supabase
        .from('challenge_participants')
        .update({
          score,
          total_time: totalTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', participantId);

      if (error) throw error;
      return { score, totalTime };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge-leaderboard'] });
    }
  });

  const getUserChallenges = useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_sessions')
        .select('*')
        .eq('creator_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ChallengeSession[];
    },
    enabled: !!user
  });

  return {
    createChallenge,
    getChallengeByLink,
    getChallengeQuestions,
    getChallengeLeaderboard,
    joinChallenge,
    submitChallengeAnswer,
    completeChallenge,
    getUserChallenges,
    isCreating: createChallenge.isPending
  };
};
