
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useStreakData = () => {
  const [streakData, setStreakData] = useState<{ day: string; streak: number }[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [todayUploaded, setTodayUploaded] = useState(false);
  const { user } = useAuth();

  const fetchStreakData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('streak_data')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const todayData = data?.find(d => d.date === today);
      setTodayUploaded(todayData?.uploaded || false);

      // Calculate streak
      let current = 0;
      let highest = 0;
      let temp = 0;

      data?.forEach((day, index) => {
        if (day.uploaded) {
          temp++;
          if (temp > highest) highest = temp;
        } else {
          temp = 0;
        }
      });

      // Calculate current streak from today backwards
      const sortedData = data?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      for (const day of sortedData || []) {
        if (day.uploaded) {
          current++;
        } else {
          break;
        }
      }

      setCurrentStreak(current);
      setHighestStreak(highest);

      // Format data for chart
      const chartData = data?.slice(-30).map((day, index) => ({
        day: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        streak: index + 1
      })) || [];

      setStreakData(chartData);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user]);

  return {
    streakData,
    currentStreak,
    highestStreak,
    todayUploaded,
    fetchStreakData
  };
};
