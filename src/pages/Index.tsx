
import React from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useOnboarding } from '../hooks/useOnboarding';
import AuthPage from '../components/AuthPage';
import Dashboard from '../components/Dashboard';
import OnboardingFlow from '../components/OnboardingFlow';
import { useNotifications } from '../hooks/useNotifications';

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, completeOnboarding } = useOnboarding();
  useNotifications();

  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (needsOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return <Dashboard />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
