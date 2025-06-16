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
      <header className="bg-green-800 border-b border-green-700 sticky top-0 z-40 overflow-hidden shadow-sm">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
            <div className="flex-1 min-w-0 max-w-full">
              <div className="flex items-center gap-2 mb-1 border border-green-400 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 inline-flex max-w-full bg-green-700">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white whitespace-nowrap">StudySmart</h1>
              </div>
              <p className="text-green-100 text-sm sm:text-base truncate max-w-full">
                {greeting}
              </p>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {preferences?.exam_type && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExamClick}
                  className="flex items-center gap-1 sm:gap-2 text-green-200 hover:text-white hover:bg-green-700 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                  title={`Click to visit ${getExamDisplayName(preferences.exam_type)} official website`}
                >
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    {getExamDisplayName(preferences.exam_type)}
                  </span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePremiumClick}
                className="p-1.5 sm:p-2 hover:bg-green-700 transition-colors flex-shrink-0"
                title={isPremium ? 'Premium Active - Manage Subscription' : 'Upgrade to Premium'}
              >
                <Crown 
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isPremium 
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' 
                      : 'text-yellow-400 hover:text-yellow-300'
                  }`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-green-200 hover:text-white hover:bg-green-700 p-1.5 sm:p-2 flex-shrink-0"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-300" />
            <Input
              placeholder="Search notes, subjects..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 bg-green-700 border-green-600 text-white placeholder-green-300 focus:border-green-500 h-10 sm:h-11 w-full"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-green-300 hover:text-white"
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
