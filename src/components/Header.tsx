
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();

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
          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
        />
      </div>
    </div>
  );
};

export default Header;
