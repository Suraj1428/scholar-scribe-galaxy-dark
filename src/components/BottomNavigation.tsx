
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
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-purple-400 bg-purple-400/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
