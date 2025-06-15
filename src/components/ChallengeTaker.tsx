
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { useChallenge, ChallengeQuestion } from '@/hooks/useChallenge';

interface ChallengeTakerProps {
  challengeId: string;
  participantId: string;
  onComplete: () => void;
  onBack: () => void;
}

const ChallengeTaker = ({ challengeId, participantId, onComplete, onBack }: ChallengeTakerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  const { getChallengeByLink, getChallengeQuestions, submitChallengeAnswer, completeChallenge } = useChallenge();
  const { data: challenge } = getChallengeByLink(challengeId);
  const { data: questions, isLoading } = getChallengeQuestions(challengeId);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const getTimeLimit = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy':
      case 'medium':
        return 60; // 1 minute
      case 'hard':
        return 180; // 3 minutes
      default:
        return 60;
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered]);

  // Reset timer for new question
  useEffect(() => {
    const timeLimit = challenge ? getTimeLimit(challenge.difficulty) : 60;
    setTimeLeft(timeLimit);
    setSelectedAnswer('');
    setIsAnswered(false);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex, challenge]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${seconds}s`;
  };

  const handleTimeUp = () => {
    if (!isAnswered && currentQuestion) {
      setIsAnswered(true);
      setShowResult(true);
      
      // Submit empty answer
      const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
      submitChallengeAnswer.mutateAsync({
        participantId,
        questionId: currentQuestion.id,
        answer: '',
        timeTaken
      });
    }
  };

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    
    try {
      await submitChallengeAnswer.mutateAsync({
        participantId,
        questionId: currentQuestion.id,
        answer,
        timeTaken
      });
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteChallenge();
    }
  };

  const handleCompleteChallenge = async () => {
    try {
      await completeChallenge.mutateAsync(participantId);
      onComplete();
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    }
  };

  const getOptionClass = (option: string) => {
    const baseClass = "w-full p-4 text-left border-2 rounded-lg transition-all cursor-pointer";
    
    if (!showResult) {
      return selectedAnswer === option
        ? `${baseClass} border-purple-400 bg-purple-500/30 text-white shadow-md`
        : `${baseClass} border-gray-500 bg-gray-700 text-white hover:border-purple-300 hover:bg-gray-600`;
    }
    
    if (option === currentQuestion?.correct_answer) {
      return `${baseClass} border-green-400 bg-green-500/30 text-green-100 shadow-md`;
    }
    
    if (selectedAnswer === option && option !== currentQuestion?.correct_answer) {
      return `${baseClass} border-red-400 bg-red-500/30 text-red-100 shadow-md`;
    }
    
    return `${baseClass} border-gray-600 bg-gray-700/50 text-gray-300`;
  };

  if (isLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading challenge...
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400 mb-4">No questions found for this challenge.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenge
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{challenge?.title}</h2>
          <p className="text-gray-400 text-sm">{challenge?.topic}</p>
        </div>
        
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <span className="text-gray-400">
            {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg leading-relaxed">
            {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionKey = `option_${option.toLowerCase()}` as keyof ChallengeQuestion;
            const optionText = currentQuestion?.[optionKey] as string;
            
            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={getOptionClass(option)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg bg-gray-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {option}
                  </span>
                  <span className="text-base font-medium">{optionText}</span>
                  {showResult && option === currentQuestion?.correct_answer && (
                    <CheckCircle className="h-6 w-6 text-green-400 ml-auto flex-shrink-0" />
                  )}
                  {showResult && selectedAnswer === option && option !== currentQuestion?.correct_answer && (
                    <XCircle className="h-6 w-6 text-red-400 ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Result */}
      {showResult && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            {selectedAnswer === currentQuestion?.correct_answer ? (
              <div className="text-green-400">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Correct!</p>
              </div>
            ) : selectedAnswer ? (
              <div className="text-red-400">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Incorrect</p>
                <p className="text-sm text-gray-400">
                  The correct answer was {currentQuestion?.correct_answer}
                </p>
              </div>
            ) : (
              <div className="text-yellow-400">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Time's up!</p>
                <p className="text-sm text-gray-400">
                  The correct answer was {currentQuestion?.correct_answer}
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleNextQuestion}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Challenge'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengeTaker;
