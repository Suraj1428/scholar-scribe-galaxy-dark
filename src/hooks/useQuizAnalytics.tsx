
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface QuizAnalytics {
  totalQuizzes: number;
  averageScore: number;
  topicsPerformance: Array<{
    topic: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    quizCount: number;
  }>;
  difficultyPerformance: Array<{
    difficulty: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
  }>;
  weakAreas: Array<{
    topic: string;
    accuracy: number;
    suggestions: string[];
  }>;
  strongAreas: Array<{
    topic: string;
    accuracy: number;
  }>;
  progressOverTime: Array<{
    date: string;
    score: number;
    topic: string;
  }>;
}

export const useQuizAnalytics = () => {
  const { user } = useAuth();

  const getQuizAnalytics = useQuery({
    queryKey: ['quiz-analytics', user?.id],
    queryFn: async (): Promise<QuizAnalytics> => {
      if (!user) throw new Error('User not authenticated');

      // Get all completed quiz sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: true });

      if (sessionsError) throw sessionsError;

      if (!sessions || sessions.length === 0) {
        return {
          totalQuizzes: 0,
          averageScore: 0,
          topicsPerformance: [],
          difficultyPerformance: [],
          weakAreas: [],
          strongAreas: [],
          progressOverTime: []
        };
      }

      // Get all quiz questions for these sessions
      const sessionIds = sessions.map(s => s.id);
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .in('quiz_session_id', sessionIds);

      if (questionsError) throw questionsError;

      // Calculate analytics
      const totalQuizzes = sessions.length;
      const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
      const totalPossible = sessions.reduce((sum, session) => sum + session.total_questions, 0);
      const averageScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

      // Topics performance
      const topicsMap = new Map();
      sessions.forEach(session => {
        const sessionQuestions = questions?.filter(q => q.quiz_session_id === session.id) || [];
        const correct = sessionQuestions.filter(q => q.is_correct).length;
        
        if (topicsMap.has(session.topic)) {
          const existing = topicsMap.get(session.topic);
          topicsMap.set(session.topic, {
            topic: session.topic,
            totalQuestions: existing.totalQuestions + session.total_questions,
            correctAnswers: existing.correctAnswers + correct,
            quizCount: existing.quizCount + 1
          });
        } else {
          topicsMap.set(session.topic, {
            topic: session.topic,
            totalQuestions: session.total_questions,
            correctAnswers: correct,
            quizCount: 1
          });
        }
      });

      const topicsPerformance = Array.from(topicsMap.values()).map(topic => ({
        ...topic,
        accuracy: topic.totalQuestions > 0 ? (topic.correctAnswers / topic.totalQuestions) * 100 : 0
      }));

      // Difficulty performance
      const difficultyMap = new Map();
      sessions.forEach(session => {
        const sessionQuestions = questions?.filter(q => q.quiz_session_id === session.id) || [];
        const correct = sessionQuestions.filter(q => q.is_correct).length;
        
        if (difficultyMap.has(session.difficulty)) {
          const existing = difficultyMap.get(session.difficulty);
          difficultyMap.set(session.difficulty, {
            difficulty: session.difficulty,
            totalQuestions: existing.totalQuestions + session.total_questions,
            correctAnswers: existing.correctAnswers + correct
          });
        } else {
          difficultyMap.set(session.difficulty, {
            difficulty: session.difficulty,
            totalQuestions: session.total_questions,
            correctAnswers: correct
          });
        }
      });

      const difficultyPerformance = Array.from(difficultyMap.values()).map(diff => ({
        ...diff,
        accuracy: diff.totalQuestions > 0 ? (diff.correctAnswers / diff.totalQuestions) * 100 : 0
      }));

      // Weak and strong areas
      const weakAreas = topicsPerformance
        .filter(topic => topic.accuracy < 70 && topic.quizCount >= 2)
        .map(topic => ({
          topic: topic.topic,
          accuracy: topic.accuracy,
          suggestions: [
            `Practice more ${topic.topic} questions`,
            `Review fundamental concepts in ${topic.topic}`,
            `Try easier difficulty level first`,
            `Study ${topic.topic} with different resources`
          ]
        }))
        .sort((a, b) => a.accuracy - b.accuracy);

      const strongAreas = topicsPerformance
        .filter(topic => topic.accuracy >= 80)
        .sort((a, b) => b.accuracy - a.accuracy);

      // Progress over time
      const progressOverTime = sessions.map(session => ({
        date: session.created_at.split('T')[0],
        score: (session.score / session.total_questions) * 100,
        topic: session.topic
      }));

      return {
        totalQuizzes,
        averageScore,
        topicsPerformance,
        difficultyPerformance,
        weakAreas,
        strongAreas,
        progressOverTime
      };
    },
    enabled: !!user
  });

  return {
    analytics: getQuizAnalytics.data,
    isLoading: getQuizAnalytics.isLoading,
    error: getQuizAnalytics.error
  };
};
