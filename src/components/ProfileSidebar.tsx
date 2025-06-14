
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, FileText, BookOpen, Clock, Timer, Crown, CheckSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { useTasks } from '@/hooks/useTasks';
import { useStreakData } from '@/hooks/useStreakData';
import { useSessionTimer } from '@/hooks/useSessionTimer';

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

  const subjects = new Set(notes.map(note => note.subject)).size;

  const analytics = [
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
      title: 'Total Tasks',
      value: tasks.length.toString(),
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 bg-gray-800 border-gray-700">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold">Profile</p>
              <p className="text-sm text-gray-400">
                {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium mb-3">Analytics Overview</h3>
            <div className="grid grid-cols-1 gap-3">
              {analytics.map((item, index) => (
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSidebar;
