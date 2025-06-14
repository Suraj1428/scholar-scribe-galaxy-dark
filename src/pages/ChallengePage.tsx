
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ChallengeLanding from '@/components/ChallengeLanding';
import ChallengeTaker from '@/components/ChallengeTaker';
import ChallengeLeaderboard from '@/components/ChallengeLeaderboard';
import { useChallenge } from '@/hooks/useChallenge';

type ChallengeView = 'landing' | 'taking' | 'leaderboard';

const ChallengePage = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ChallengeView>('landing');
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('');

  const { getChallengeByLink } = useChallenge();
  const { data: challenge, isLoading, error } = getChallengeByLink(challengeId || '');

  if (!challengeId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Challenge Link</h1>
          <p className="text-gray-400 mb-6">This challenge link is not valid.</p>
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
          <h1 className="text-xl font-bold mb-2">Loading Challenge...</h1>
          <p className="text-gray-400">Please wait while we load the challenge details.</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
          <p className="text-gray-400 mb-2">This challenge doesn't exist or has expired.</p>
          <p className="text-gray-500 mb-6 text-sm">
            {error ? 'Connection error - please check your internet connection and try again.' : 'Please check the link and try again.'}
          </p>
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const handleJoinChallenge = (participantId: string) => {
    setCurrentParticipantId(participantId);
    setCurrentView('taking');
  };

  const handleChallengeComplete = () => {
    setCurrentView('leaderboard');
  };

  const handleViewLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setCurrentParticipantId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'taking':
        return (
          <ChallengeTaker 
            challengeId={challengeId}
            participantId={currentParticipantId}
            onComplete={handleChallengeComplete}
            onBack={handleBackToLanding}
          />
        );
      
      case 'leaderboard':
        return (
          <ChallengeLeaderboard 
            challengeId={challengeId}
            onBack={handleBackToLanding}
          />
        );
      
      default:
        return (
          <ChallengeLanding 
            challengeId={challengeId}
            onJoinChallenge={handleJoinChallenge}
            onViewLeaderboard={handleViewLeaderboard}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default ChallengePage;
