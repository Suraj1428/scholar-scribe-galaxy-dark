
import React, { useState } from 'react';
import Header from './Header';
import StatsCards from './StatsCards';
import StreakTracker from './StreakTracker';
import NotesSection from './NotesSection';
import GallerySection from './GallerySection';
import BookViewSection from './BookViewSection';
import TaskManager from './TaskManager';
import BottomNavigation from './BottomNavigation';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('notes');

  const renderSection = () => {
    switch (activeSection) {
      case 'notes':
        return (
          <div className="space-y-4 sm:space-y-6">
            <StatsCards />
            <StreakTracker />
            <NotesSection />
          </div>
        );
      case 'gallery':
        return <GallerySection />;
      case 'book':
        return <BookViewSection />;
      case 'tasks':
        return <TaskManager />;
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-1 min-h-0">
        {renderSection()}
      </div>
      <BottomNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
};

export default Dashboard;
