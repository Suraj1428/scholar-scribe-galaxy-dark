
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  X, User, Camera, Trophy, TrendingUp, Target, Calendar, 
  BookOpen, Brain, Clock, Award, BarChart3, Zap 
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { QuizAnalytics } from '@/hooks/useQuizAnalytics';

interface FullScreenProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  avatarUrl: string;
  analytics: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }>;
  quizAnalytics?: QuizAnalytics;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FullScreenProfile = ({ 
  isOpen, 
  onClose, 
  user, 
  avatarUrl, 
  analytics, 
  quizAnalytics,
  onImageUpload,
  uploadingImage,
  fileInputRef
}: FullScreenProfileProps) => {
  
  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Expert', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (accuracy >= 80) return { level: 'Advanced', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (accuracy >= 70) return { level: 'Intermediate', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (accuracy >= 60) return { level: 'Beginner', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { level: 'Learning', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const performance = getPerformanceLevel(quizAnalytics?.averageScore || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900 border-gray-700 p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-6 text-white">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={avatarUrl} alt="Profile" />
                <AvatarFallback className="bg-gray-600 text-white text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="ghost"
                className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full border-2 border-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-white" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user?.user_metadata?.full_name || 'Student'}
              </h1>
              <p className="text-white/80 text-lg mb-2">{user?.email}</p>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full ${performance.bg} ${performance.color} font-medium`}>
                  {performance.level}
                </div>
                {quizAnalytics && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <span className="font-medium">{quizAnalytics.averageScore.toFixed(1)}% Avg Score</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-400" />
                Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {analytics.map((item, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                      <p className="text-white text-xl font-bold">{item.value}</p>
                      <p className="text-gray-400 text-sm">{item.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quiz Performance */}
            {quizAnalytics && (
              <>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-400" />
                      Quiz Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Overall Accuracy</span>
                        <span className="text-white font-medium">{quizAnalytics.averageScore.toFixed(1)}%</span>
                      </div>
                      <Progress value={quizAnalytics.averageScore} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-400">{quizAnalytics.totalQuizzes}</p>
                        <p className="text-gray-400 text-sm">Total Quizzes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-400">{quizAnalytics.strongAreas.length}</p>
                        <p className="text-gray-400 text-sm">Strong Areas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Topics Performance */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-400" />
                      Subject Mastery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quizAnalytics.topicsPerformance.slice(0, 5).map((topic, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white font-medium">{topic.topic}</span>
                            <span className="text-gray-400">{topic.accuracy.toFixed(1)}%</span>
                          </div>
                          <Progress value={topic.accuracy} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Difficulty Analysis */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      Difficulty Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quizAnalytics.difficultyPerformance.map((diff, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              diff.difficulty === 'easy' ? 'bg-green-400' :
                              diff.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                            }`} />
                            <span className="text-white capitalize">{diff.difficulty}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{diff.accuracy.toFixed(1)}%</p>
                            <p className="text-gray-400 text-sm">{diff.totalQuestions} questions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Areas for Improvement */}
                {quizAnalytics.weakAreas.length > 0 && (
                  <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-400" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {quizAnalytics.weakAreas.slice(0, 3).map((area, index) => (
                          <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-white font-medium">{area.topic}</h3>
                              <span className="text-red-400 font-medium">{area.accuracy.toFixed(1)}%</span>
                            </div>
                            <div className="space-y-2">
                              {area.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                                <p key={suggestionIndex} className="text-gray-300 text-sm flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">•</span>
                                  {suggestion}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Strong Areas */}
                {quizAnalytics.strongAreas.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-400" />
                        Strong Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {quizAnalytics.strongAreas.slice(0, 5).map((area, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-white">{area.topic}</span>
                            <span className="text-green-400 font-medium">{area.accuracy.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Account Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white">{user?.user_metadata?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email Address</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Sign In</p>
                  <p className="text-white">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenProfile;
