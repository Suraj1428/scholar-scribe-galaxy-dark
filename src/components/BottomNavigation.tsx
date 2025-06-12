
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Image, BookOpen, CheckSquare } from 'lucide-react';

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const sections = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'book', label: 'Book View', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2">
      <div className="flex justify-around">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            onClick={() => onSectionChange(section.id)}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              activeSection === section.id
                ? 'text-purple-400 bg-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <section.icon className="h-5 w-5" />
            <span className="text-xs">{section.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
