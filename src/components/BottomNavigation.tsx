
import React from 'react';
import { BookOpen, Image, User, Brain, Users } from 'lucide-react';

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const navItems = [
    { id: 'notes', icon: BookOpen, label: 'Notes' },
    { id: 'quiz', icon: Brain, label: 'Quiz' },
    { id: 'challenge', icon: Users, label: 'Challenge' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-green-800 border-t border-green-700 px-1 py-1.5 z-50 safe-area-bottom shadow-lg">
      <div className="flex justify-between items-center w-full max-w-full overflow-x-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center space-y-0.5 px-0.5 py-1 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive
                  ? 'text-white bg-green-700'
                  : 'text-green-200 hover:text-white hover:bg-green-700'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
