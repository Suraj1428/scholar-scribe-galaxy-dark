
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();

    const checkIncompleteTasks = async () => {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false);

      if (tasks && tasks.length > 0) {
        const overdueTasks = tasks.filter(task => {
          if (!task.due_date) return false;
          return new Date(task.due_date) < new Date();
        });

        if (overdueTasks.length > 0) {
          const message = `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}!`;
          
          if (Notification.permission === 'granted') {
            new Notification('StudyNotes - Task Reminder', {
              body: message,
              icon: '/favicon.ico'
            });
          }

          toast({
            title: "Task Reminder",
            description: message,
            variant: "destructive",
          });
        }
      }
    };

    // Check for incomplete tasks every 30 minutes
    const interval = setInterval(checkIncompleteTasks, 30 * 60 * 1000);
    
    // Check immediately
    checkIncompleteTasks();

    return () => clearInterval(interval);
  }, [user, toast]);
};
