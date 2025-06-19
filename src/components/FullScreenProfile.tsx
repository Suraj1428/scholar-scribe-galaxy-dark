import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, User, Camera, Trophy, TrendingUp, Target, Calendar, 
  BookOpen, Brain, Clock, Award, BarChart3, Zap, Settings, ExternalLink 
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { QuizAnalytics } from '@/hooks/useQuizAnalytics';
import { UserPreferences } from '@/hooks/useUserPreferences';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  preferences?: UserPreferences | null;
  onPreferencesUpdate?: () => void;
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
  fileInputRef,
  preferences,
  onPreferencesUpdate
}: FullScreenProfileProps) => {
  const [selectedExamType, setSelectedExamType] = useState(preferences?.exam_type || '');
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const { toast } = useToast();
  
  const examTypes = [
    { value: 'upsc', label: 'UPSC', website: 'https://www.upsc.gov.in/' },
    { value: 'btech', label: 'BTECH', website: 'https://www.jntuacek.ac.in/'},
    { value: 'gate', label: 'GATE', website: 'https://gate.iitg.ac.in/' },
    { value: 'ssc', label: 'SSC', website: 'https://ssc.nic.in/' },
    { value: 'rrb', label: 'RRB Railway', website: 'https://www.rrbcdg.gov.in/' },
    { value: 'neet', label: 'NEET', website: 'https://neet.nta.nic.in/' },
    { value: 'jee', label: 'JEE', website: 'https://jeemain.nta.nic.in/' },
    { value: 'cat', label: 'CAT', website: 'https://iimcat.ac.in/' },
    { value: 'ibps', label: 'IBPS', website: 'https://www.ibps.in/' },
    { value: 'nda', label: 'NDA', website: 'https://www.upsc.gov.in/examinations/active-examinations/national-defence-academy-naval-academy-examination-i' },
    { value: 'cds', label: 'CDS', website: 'https://www.upsc.gov.in/examinations/active-examinations/combined-defence-services-examination-i' },
    { value: 'capf', label: 'CAPF', website: 'https://www.upsc.gov.in/examinations/active-examinations/central-armed-police-forces-assistant-commandant' },
    { value: 'afcat', label: 'AFCAT', website: 'https://afcat.cdac.in/' },
    { value: 'clat', label: 'CLAT', website: 'https://consortiumofnlus.ac.in/' },
    { value: 'net', label: 'UGC NET', website: 'https://ugcnet.nta.nic.in/' },
    { value: 'other', label: 'Other', website: null }
  ];

  const handleExamPreferenceUpdate = async () => {
    if (!user || !selectedExamType) return;

    setIsUpdatingPreferences(true);
    try {
      if (preferences) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({ 
            exam_type: selectedExamType,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            exam_type: selectedExamType,
            onboarding_completed: true
          });

        if (error) throw error;
      }

      toast({
        title: "Preferences Updated",
        description: "Your exam preference has been saved successfully.",
      });

      // Call the callback to refresh preferences
      onPreferencesUpdate?.();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update exam preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  const handleExamWebsiteClick = (examType: string) => {
    const exam = examTypes.find(e => e.value === examType);
    if (exam?.website) {
      window.open(exam.website, '_blank');
    }
  };
  
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
      <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[800px] bg-gray-900 border-gray-700 p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white/20 p-2"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-white">
            <div className="relative flex-shrink-0">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 sm:border-4 border-white/20">
                <AvatarImage src={avatarUrl} alt="Profile" />
                <AvatarFallback className="bg-gray-600 text-white text-lg sm:text-xl lg:text-2xl">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="ghost"
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full border-2 border-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
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
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                {user?.user_metadata?.full_name || 'Student'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-2">{user?.email}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4">
                <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full ${performance.bg} ${performance.color} font-medium text-sm`}>
                  {performance.level}
                </div>
                {quizAnalytics && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-medium text-sm sm:text-base">{quizAnalytics.averageScore.toFixed(1)}% Avg Score</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto flex-1">
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                {analytics.map((item, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
                      <item.icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 mx-auto mb-1 sm:mb-2 ${item.color}`} />
                      <p className="text-white text-sm sm:text-lg lg:text-xl font-bold">{item.value}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{item.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Exam Preferences */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    Exam Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-gray-300 text-xs sm:text-sm mb-2 block">Current Exam Target</label>
                    <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 sm:h-10">
                        <SelectValue placeholder="Select your target exam" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                        {examTypes.map((exam) => (
                          <SelectItem key={exam.value} value={exam.value} className="text-white hover:bg-gray-600">
                            {exam.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleExamPreferenceUpdate}
                    disabled={isUpdatingPreferences || !selectedExamType || selectedExamType === preferences?.exam_type}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 h-8 sm:h-10 text-sm"
                  >
                    {isUpdatingPreferences ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Save Preference'
                    )}
                  </Button>
                  {preferences?.exam_type && (
                    <div className="space-y-2">
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Current: {examTypes.find(e => e.value === preferences.exam_type)?.label}
                      </p>
                      {examTypes.find(e => e.value === preferences.exam_type)?.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExamWebsiteClick(preferences.exam_type)}
                          className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 h-8 sm:h-9 text-xs sm:text-sm"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Visit Official Website
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quiz Performance */}
              {quizAnalytics && (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                        <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                        Quiz Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                          <span className="text-gray-400">Overall Accuracy</span>
                          <span className="text-white font-medium">{quizAnalytics.averageScore.toFixed(1)}%</span>
                        </div>
                        <Progress value={quizAnalytics.averageScore} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                        <div>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">{quizAnalytics.totalQuizzes}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">Total Quizzes</p>
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">{quizAnalytics.strongAreas.length}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">Strong Areas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Topics Performance */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                        Subject Mastery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 sm:space-y-3">
                        {quizAnalytics.topicsPerformance.slice(0, 5).map((topic, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                              <span className="text-white font-medium truncate">{topic.topic}</span>
                              <span className="text-gray-400">{topic.accuracy.toFixed(1)}%</span>
                            </div>
                            <Progress value={topic.accuracy} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Information */}
                  <Card className="bg-gray-800 border-gray-700 lg:col-start-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                        Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Full Name</p>
                        <p className="text-white text-sm sm:text-base">{user?.user_metadata?.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Email Address</p>
                        <p className="text-white text-sm sm:text-base break-all">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Member Since</p>
                        <p className="text-white text-sm sm:text-base">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Last Sign In</p>
                        <p className="text-white text-sm sm:text-base">
                          {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Difficulty Analysis */}
                  <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                        Difficulty Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {quizAnalytics.difficultyPerformance.map((diff, index) => (
                          <div key={index} className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                                diff.difficulty === 'easy' ? 'bg-green-400' :
                                diff.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                              }`} />
                              <span className="text-white capitalize font-medium text-sm sm:text-base">{diff.difficulty}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{diff.accuracy.toFixed(1)}%</p>
                              <p className="text-gray-400 text-xs sm:text-sm">{diff.totalQuestions} questions</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  {quizAnalytics.weakAreas.length > 0 && (
                    <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                          Areas for Improvement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:gap-4">
                          {quizAnalytics.weakAreas.slice(0, 3).map((area, index) => (
                            <div key={index} className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2 sm:mb-3">
                                <h3 className="text-white font-medium text-sm sm:text-base">{area.topic}</h3>
                                <span className="text-red-400 font-medium text-sm sm:text-base">{area.accuracy.toFixed(1)}%</span>
                              </div>
                              <div className="space-y-1 sm:space-y-2">
                                {area.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                                  <p key={suggestionIndex} className="text-gray-300 text-xs sm:text-sm flex items-start gap-2">
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
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                          Strong Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 sm:space-y-3">
                          {quizAnalytics.strongAreas.slice(0, 5).map((area, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-white text-sm sm:text-base">{area.topic}</span>
                              <span className="text-green-400 font-medium text-sm sm:text-base">{area.accuracy.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenProfile;
