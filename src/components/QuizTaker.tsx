
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { useQuiz, QuizQuestion } from '@/hooks/useQuiz';

interface QuizTakerProps {
  sessionId: string;
  onComplete: () => void;
  onBack: () => void;
}

const QuizTaker = ({ sessionId, onComplete, onBack }: QuizTakerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  
  const { getQuizQuestions, submitAnswer, completeQuiz } = useQuiz();
  const { data: questions, isLoading } = getQuizQuestions(sessionId);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

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
    setTimeLeft(30);
    setSelectedAnswer('');
    setIsAnswered(false);
    setShowResult(false);
  }, [currentQuestionIndex]);

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setShowResult(true);
    }
  };

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    try {
      await submitAnswer.mutateAsync({
        questionId: currentQuestion.id,
        answer
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
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    try {
      await completeQuiz.mutateAsync(sessionId);
      onComplete();
    } catch (error) {
      console.error('Failed to complete quiz:', error);
    }
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'border-purple-500 bg-purple-500/20'
        : 'border-gray-600 hover:border-gray-500';
    }
    
    if (option === currentQuestion?.correct_answer) {
      return 'border-green-500 bg-green-500/20 text-green-400';
    }
    
    if (selectedAnswer === option && option !== currentQuestion?.correct_answer) {
      return 'border-red-500 bg-red-500/20 text-red-400';
    }
    
    return 'border-gray-600 opacity-50';
  };

  if (isLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading quiz...
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400 mb-4">No questions found for this quiz.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
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
        
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {timeLeft}s
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
        <CardContent className="space-y-3">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionKey = `option_${option.toLowerCase()}` as keyof QuizQuestion;
            const optionText = currentQuestion?.[optionKey] as string;
            
            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${getOptionClass(option)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                    {option}
                  </span>
                  <span>{optionText}</span>
                  {showResult && option === currentQuestion?.correct_answer && (
                    <CheckCircle className="h-5 w-5 text-green-400 ml-auto" />
                  )}
                  {showResult && selectedAnswer === option && option !== currentQuestion?.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-400 ml-auto" />
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
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizTaker;
