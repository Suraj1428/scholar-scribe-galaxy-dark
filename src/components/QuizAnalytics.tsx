
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain, 
  Award, 
  AlertTriangle,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { usePremium } from '@/hooks/usePremium';

const QuizAnalytics = () => {
  const { analytics, isLoading } = useQuizAnalytics();
  const { isPremium } = usePremium();

  if (!isPremium) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Premium Analytics</h3>
          <p className="text-gray-400 mb-4">
            Upgrade to premium to unlock detailed quiz analytics, performance insights, and personalized recommendations.
          </p>
          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
            Premium Feature
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading analytics...
      </div>
    );
  }

  if (!analytics || analytics.totalQuizzes === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Quiz Data Yet</h3>
          <p className="text-gray-400">
            Complete some quizzes to see your performance analytics and improvement suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-400';
    if (accuracy >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 80) return <TrendingUp className="h-4 w-4 text-yellow-400" />;
    if (accuracy >= 60) return <Target className="h-4 w-4 text-yellow-400" />;
    return <TrendingDown className="h-4 w-4 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Quiz Analytics</h2>
        <p className="text-gray-400">Track your performance and discover areas for improvement</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Total Quizzes</h3>
            <p className="text-2xl font-bold text-purple-400">{analytics.totalQuizzes}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Average Score</h3>
            <p className={`text-2xl font-bold ${getPerformanceColor(analytics.averageScore)}`}>
              {analytics.averageScore.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Strong Areas</h3>
            <p className="text-2xl font-bold text-yellow-400">{analytics.strongAreas.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Topics Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Topics Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.topicsPerformance.map((topic) => (
            <div key={topic.topic} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPerformanceIcon(topic.accuracy)}
                  <span className="text-white font-medium">{topic.topic}</span>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                    {topic.quizCount} quiz{topic.quizCount !== 1 ? 'es' : ''}
                  </Badge>
                </div>
                <span className={`font-bold ${getPerformanceColor(topic.accuracy)}`}>
                  {topic.accuracy.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={topic.accuracy} 
                className="h-2"
              />
              <p className="text-xs text-gray-400">
                {topic.correctAnswers}/{topic.totalQuestions} questions correct
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weak Areas & Suggestions */}
      {analytics.weakAreas.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.weakAreas.map((area) => (
              <div key={area.topic} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{area.topic}</h4>
                  <span className="text-red-400 font-bold">{area.accuracy.toFixed(1)}%</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-300 mb-2">💡 Suggestions:</p>
                  {area.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-sm text-gray-400">• {suggestion}</p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Strong Areas */}
      {analytics.strongAreas.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-green-400" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.strongAreas.map((area) => (
                <div key={area.topic} className="border border-green-500/20 rounded-lg p-3 bg-green-500/5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{area.topic}</span>
                    <span className="text-green-400 font-bold text-sm">{area.accuracy.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Difficulty Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Performance by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.difficultyPerformance.map((diff) => (
            <div key={diff.difficulty} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium capitalize">{diff.difficulty}</span>
                <span className={`font-bold ${getPerformanceColor(diff.accuracy)}`}>
                  {diff.accuracy.toFixed(1)}%
                </span>
              </div>
              <Progress value={diff.accuracy} className="h-2" />
              <p className="text-xs text-gray-400">
                {diff.correctAnswers}/{diff.totalQuestions} questions correct
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizAnalytics;
