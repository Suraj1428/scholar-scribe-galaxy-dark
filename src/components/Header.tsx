import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LogOut, X, Target, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { usePremium } from '@/hooks/usePremium';
import SubscriptionModal from './SubscriptionModal';

interface HeaderProps {
  onSearchResults?: (results: any[]) => void;
  onClearSearch?: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchResults, onClearSearch, activeSection, onSectionChange }) => {
  const { user, signOut } = useAuth();
  const { notes } = useNotes();
  const { preferences } = useUserPreferences();
  const { isPremium } = usePremium();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [greeting, setGreeting] = useState('');

  // Update greeting based on current time
  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good evening');
      } else {
        setGreeting('Good night');
      }
    };

    // Update greeting immediately
    updateGreeting();
    
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      onClearSearch?.();
      return;
    }

    const searchResults = notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.subject.toLowerCase().includes(query.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(query.toLowerCase()))
    );

    onSearchResults?.(searchResults);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onClearSearch?.();
  };

  const getExamDisplayName = (examType: string) => {
    const examMap: { [key: string]: string } = {
      'upsc': 'UPSC',
      'gate': 'GATE', 
      'ssc': 'SSC',
      'rrb': 'RRB Railway',
      'neet': 'NEET',
      'jee': 'JEE',
      'cat': 'CAT',
      'ibps': 'IBPS',
      'nda': 'NDA',
      'cds': 'CDS',
      'capf': 'CAPF',
      'afcat': 'AFCAT',
      'clat': 'CLAT',
      'net': 'UGC NET',
      'other': 'Custom Exam'
    };
    return examMap[examType] || examType.toUpperCase();
  };

  const handlePremiumClick = () => {
    setIsSubscriptionOpen(true);
  };

  const examTypes = [
    { value: 'upsc', label: 'UPSC', website: 'https://www.upsc.gov.in/' },
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

  const handleExamClick = () => {
    if (!preferences?.exam_type) return;
    
    const exam = examTypes.find(e => e.value === preferences.exam_type);
    if (exam?.website) {
      window.open(exam.website, '_blank');
    }
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">StudyNotes</h1>
              <p className="text-gray-400 text-xs sm:text-sm truncate">
                {greeting}, {user?.user_metadata?.full_name || user?.email}!
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {preferences?.exam_type && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExamClick}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 transition-colors"
                  title={`Click to visit ${getExamDisplayName(preferences.exam_type)} official website`}
                >
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">
                    {getExamDisplayName(preferences.exam_type)}
                  </span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePremiumClick}
                className="p-2 hover:bg-gray-700/50 transition-colors"
                title={isPremium ? 'Premium Active - Manage Subscription' : 'Upgrade to Premium'}
              >
                <Crown 
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isPremium 
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' 
                      : 'text-yellow-300 hover:text-yellow-200'
                  }`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-400 hover:text-white p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notes, subjects..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 h-10 sm:h-11"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <SubscriptionModal 
        isOpen={isSubscriptionOpen} 
        onClose={() => setIsSubscriptionOpen(false)} 
      />
    </>
  );
};

export default Header;
