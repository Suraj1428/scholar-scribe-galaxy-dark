
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, User, LogOut, X, Minimize2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';

interface HeaderProps {
  onSearchResults?: (results: any[]) => void;
  onClearSearch?: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchResults, onClearSearch, activeSection, onSectionChange }) => {
  const { user, signOut } = useAuth();
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">StudyNotes</h1>
          <p className="text-gray-400 text-sm">
            Good morning, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {onSectionChange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange('compress')}
              className={`flex items-center gap-2 ${
                activeSection === 'compress' 
                  ? 'text-purple-400 bg-purple-500/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Minimize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compress</span>
            </Button>
          )}
          <Bell className="h-6 w-6 text-gray-400" />
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search notes, subjects..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
