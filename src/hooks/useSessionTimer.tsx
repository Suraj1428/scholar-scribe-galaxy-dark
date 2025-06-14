
import { useState, useEffect, useRef } from 'react';

export const useSessionTimer = () => {
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [currentSessionTime, setCurrentSessionTime] = useState<number>(0);
  const [longestSession, setLongestSession] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load longest session from localStorage
    const savedLongestSession = localStorage.getItem('longestSession');
    if (savedLongestSession) {
      setLongestSession(parseInt(savedLongestSession));
    }

    // Start session timer
    const startTime = Date.now();
    setSessionStartTime(startTime);

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const sessionDuration = Math.floor((currentTime - startTime) / 1000);
      setCurrentSessionTime(sessionDuration);
    }, 1000);

    // Cleanup function to save session when component unmounts or user leaves
    const handleBeforeUnload = () => {
      const endTime = Date.now();
      const sessionDuration = Math.floor((endTime - startTime) / 1000);
      
      if (sessionDuration > longestSession) {
        localStorage.setItem('longestSession', sessionDuration.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Save session on cleanup
    };
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  return {
    currentSessionTime,
    longestSession,
    formatTime
  };
};
