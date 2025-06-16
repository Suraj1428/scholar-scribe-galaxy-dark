import React, { useState } from 'react';
import Header from './Header';
import StatsCards from './StatsCards';
import StreakTracker from './StreakTracker';
import NotesSection from './NotesSection';
import GallerySection from './GallerySection';
import BookViewSection from './BookViewSection';
import QuizSection from './QuizSection';
import ChallengeSection from './ChallengeSection';
import BottomNavigation from './BottomNavigation';
import SearchResults from './SearchResults';
import FullScreenProfile from './FullScreenProfile';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { useTasks } from '@/hooks/useTasks';
import { useStreakData } from '@/hooks/useStreakData';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { supabase } from '@/integrations/supabase/client';
import { User, Calendar, FileText, BookOpen, Clock, Timer, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('notes');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { notes } = useNotes();
  const { tasks } = useTasks();
  const { currentStreak } = useStreakData();
  const { currentSessionTime, longestSession, formatTime } = useSessionTimer();
  const { analytics } = useQuizAnalytics();
  const { preferences, fetchPreferences } = useUserPreferences();

  React.useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

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

  const subjects = new Set(notes.map(note => note.subject)).size;
  const completedTasks = tasks.filter(task => task.completed).length;

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

  const renderSection = () => {
    if (isSearching) {
      return <SearchResults results={searchResults} />;
    }

    switch (activeSection) {
      case 'notes':
        return (
          <div className="space-y-4 sm:space-y-6">
            <StatsCards />
            <StreakTracker />
            <NotesSection />
          </div>
        );
      case 'quiz':
        return <QuizSection />;
      case 'challenge':
        return <ChallengeSection />;
      case 'gallery':
        return <GallerySection />;
      case 'book':
        return <BookViewSection />;
      case 'profile':
        return (
          <FullScreenProfile 
            isOpen={true}
            onClose={() => setActiveSection('notes')}
            user={user}
            avatarUrl={avatarUrl}
            analytics={analytics_data}
            quizAnalytics={analytics}
            onImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
            fileInputRef={fileInputRef}
            preferences={preferences}
            onPreferencesUpdate={fetchPreferences}
          />
        );
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <StatsCards />
            <StreakTracker />
            <NotesSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-green-100 text-gray-800">
      <Header 
        onSearchResults={handleSearchResults} 
        onClearSearch={handleClearSearch}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {activeSection !== 'profile' && (
        <main className="pb-20 smooth-scroll w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            {renderSection()}
          </div>
        </main>
      )}
      {activeSection === 'profile' && renderSection()}
      <BottomNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />
    </div>
  );
};

export default Dashboard;
