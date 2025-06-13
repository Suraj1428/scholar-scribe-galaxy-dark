
import React from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import AuthPage from '../components/AuthPage';
import Dashboard from '../components/Dashboard';
import { useNotifications } from '../hooks/useNotifications';

const AppContent = () => {
  const { user, loading } = useAuth();
  useNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
