
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">StudyNotes</h1>
          <p className="text-gray-400 text-sm">Good morning, Student!</p>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-gray-400" />
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search notes, subjects..."
          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
        />
      </div>
      
      <div className="mt-4">
        <h2 className="text-sm text-gray-400 mb-2">Inspiring Scientists</h2>
        <div className="flex space-x-3 overflow-x-auto">
          {[
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
          ].map((src, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={src}
                alt={`Scientist ${index + 1}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
