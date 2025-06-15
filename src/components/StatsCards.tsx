
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen, Calendar, Crown, Clock, Timer } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useTasks } from '@/hooks/useTasks';
import { useStreakData } from '@/hooks/useStreakData';
import { useSessionTimer } from '@/hooks/useSessionTimer';

const StatsCards = () => {
  const { notes } = useNotes();
  const { tasks } = useTasks();
  const { currentStreak } = useStreakData();
  const { currentSessionTime, longestSession, formatTime } = useSessionTimer();

  const subjects = new Set(notes.map(note => note.subject)).size;

  const stats = [
    {
      title: 'Total Notes',
      value: notes.length.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Subjects',
      value: subjects.toString(),
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Streak',
      value: currentStreak.toString(),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Tasks',
      value: tasks.length.toString(),
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Present Time',
      value: formatTime(currentSessionTime),
      icon: Timer,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    },
    {
      title: 'Longest Slot',
      value: formatTime(longestSession),
      icon: Clock,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-sky-50 border-sky-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs mb-1">{stat.title}</p>
                  <p className="text-gray-800 text-lg font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
