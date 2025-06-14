import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Clock, CheckSquare, BarChart3, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const examOptions = [
    { id: 'upsc', name: 'UPSC', description: 'Civil Services Examination' },
    { id: 'gate', name: 'GATE', description: 'Graduate Aptitude Test in Engineering' },
    { id: 'ssc', name: 'SSC', description: 'Staff Selection Commission' },
    { id: 'neet', name: 'NEET', description: 'Medical Entrance Exam' },
    { id: 'jee', name: 'JEE', description: 'Engineering Entrance Exam' },
    { id: 'cat', name: 'CAT', description: 'Management Entrance Exam' },
    { id: 'other', name: 'Other', description: 'Custom Exam Preparation' }
  ];

  const appFeatures = [
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Create, organize and access your study notes anywhere'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and track your study goals with precision'
    },
    {
      icon: Clock,
      title: 'Study Sessions',
      description: 'Track your study time and build consistent habits'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize your study tasks and stay on track'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Monitor your progress with detailed insights'
    },
    {
      icon: Users,
      title: 'All-in-One',
      description: 'Everything you need for exam preparation in one place'
    }
  ];

  const handleSavePreferences = async () => {
    if (!selectedExam) {
      toast({
        title: "Please select an exam",
        description: "Choose which exam you're preparing for to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user?.id,
          exam_type: selectedExam,
          onboarding_completed: true
        });

      if (error) throw error;

      toast({
        title: "Welcome to StudyNotes!",
        description: "Your preferences have been saved. Let's begin your study journey!",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Welcome to StudyNotes!</h2>
        <p className="text-gray-400">Let's get you started on your study journey</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Which exam are you preparing for?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examOptions.map((exam) => (
            <Card
              key={exam.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedExam === exam.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
              onClick={() => setSelectedExam(exam.id)}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-white">{exam.name}</h4>
                <p className="text-sm text-gray-400">{exam.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setCurrentStep(2)}
          disabled={!selectedExam}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">About StudyNotes</h2>
        <p className="text-gray-400">Your complete study companion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appFeatures.map((feature, index) => (
          <Card key={index} className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <feature.icon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 rounded-lg border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-2">Ready to excel in your {examOptions.find(e => e.id === selectedExam)?.name} preparation?</h3>
        <p className="text-gray-300">StudyNotes provides all the tools you need to stay organized, track progress, and achieve your goals.</p>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(1)}
          className="text-gray-400 hover:text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleSavePreferences}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? 'Setting up...' : "Let's Begin!"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800/90 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-purple-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-purple-600' : 'bg-gray-600'}`} />
            <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-600'}`} />
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
