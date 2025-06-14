
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Image, BookOpen, CheckSquare, Minimize2, Brain } from 'lucide-react';

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const sections = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'compress', label: 'Compress', icon: Minimize2 }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 py-2 z-50 safe-area-bottom">
      <div className="flex justify-around max-w-lg mx-auto">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            onClick={() => onSectionChange(section.id)}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-2 text-xs ${
              activeSection === section.id
                ? 'text-purple-400 bg-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <section.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs leading-none">{section.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
