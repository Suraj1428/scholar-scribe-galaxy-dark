
import React, { useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, FileText, BookOpen, Clock, Timer, Crown, CheckSquare, Camera, Maximize2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { useTasks } from '@/hooks/useTasks';
import { useStreakData } from '@/hooks/useStreakData';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import FullScreenProfile from './FullScreenProfile';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
  const { user } = useAuth();
  const { notes } = useNotes();
  const { tasks } = useTasks();
  const { currentStreak } = useStreakData();
  const { currentSessionTime, longestSession, formatTime } = useSessionTimer();
  const { analytics } = useQuizAnalytics();
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = new Set(notes.map(note => note.subject)).size;
  const completedTasks = tasks.filter(task => task.completed).length;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('notes-files')
        .getPublicUrl(fileName);

      setAvatarUrl(data.publicUrl);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const analytics_data = [
    {
      title: 'Total Notes',
      value: notes.length.toString(),
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      title: 'Subjects',
      value: subjects.toString(),
      icon: BookOpen,
      color: 'text-green-400'
    },
    {
      title: 'Current Streak',
      value: currentStreak.toString(),
      icon: Calendar,
      color: 'text-orange-400'
    },
    {
      title: 'Completed Tasks',
      value: `${completedTasks}/${tasks.length}`,
      icon: CheckSquare,
      color: 'text-purple-400'
    },
    {
      title: 'Present Session',
      value: formatTime(currentSessionTime),
      icon: Timer,
      color: 'text-cyan-400'
    },
    {
      title: 'Longest Session',
      value: formatTime(longestSession),
      icon: Clock,
      color: 'text-pink-400'
    }
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-80 bg-gray-800 border-gray-700">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatarUrl} alt="Profile" />
                    <AvatarFallback className="bg-purple-600 text-white">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -bottom-1 -right-1 w-6 h-6 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3 text-white" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold">Profile</p>
                  <p className="text-sm text-gray-400">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullScreenOpen(true)}
                className="text-gray-400 hover:text-white p-2"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-3">Quick Analytics</h3>
              <div className="grid grid-cols-1 gap-3">
                {analytics_data.slice(0, 4).map((item, index) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-300 text-sm">{item.title}</p>
                          <p className="text-white text-lg font-bold">{item.value}</p>
                        </div>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Account Info</h3>
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-300 text-sm">Email</p>
                      <p className="text-white text-sm">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Member Since</p>
                      <p className="text-white text-sm">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => setIsFullScreenOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              View Full Analytics
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <FullScreenProfile 
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        user={user}
        avatarUrl={avatarUrl}
        analytics={analytics_data}
        quizAnalytics={analytics}
        onImageUpload={handleImageUpload}
        uploadingImage={uploadingImage}
        fileInputRef={fileInputRef}
      />
    </>
  );
};

export default ProfileSidebar;
