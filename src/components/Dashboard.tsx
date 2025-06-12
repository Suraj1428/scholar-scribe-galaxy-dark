
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
          <>
            <StatsCards />
            <StreakTracker />
            <NotesSection />
          </>
        );
      case 'gallery':
        return <GallerySection />;
      case 'book':
        return <BookViewSection />;
      case 'tasks':
        return <TaskManager />;
      default:
        return (
          <>
            <StatsCards />
            <StreakTracker />
            <NotesSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <Header />
      <div className="flex-1">
        {renderSection()}
      </div>
      <BottomNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
};

export default Dashboard;
