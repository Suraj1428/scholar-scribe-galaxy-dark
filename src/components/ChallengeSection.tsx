
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Trophy, Target } from 'lucide-react';
import ChallengeCreator from './ChallengeCreator';
import ChallengeLanding from './ChallengeLanding';
import ChallengeTaker from './ChallengeTaker';
import ChallengeLeaderboard from './ChallengeLeaderboard';

type ChallengeView = 'menu' | 'create' | 'landing' | 'taking' | 'leaderboard';

const ChallengeSection = () => {
  const [currentView, setCurrentView] = useState<ChallengeView>('menu');
  const [currentChallengeId, setCurrentChallengeId] = useState<string>('');
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('');

  const handleCreateChallenge = () => {
    setCurrentView('create');
  };

  const handleChallengeCreated = (challengeId: string) => {
    setCurrentChallengeId(challengeId);
    setCurrentView('leaderboard');
  };

  const handleViewChallenge = (challengeId: string) => {
    setCurrentChallengeId(challengeId);
    setCurrentView('landing');
  };

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

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setCurrentChallengeId('');
    setCurrentParticipantId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <ChallengeCreator 
            onChallengeCreated={handleChallengeCreated}
          />
        );
      
      case 'landing':
        return (
          <ChallengeLanding 
            challengeId={currentChallengeId}
            onJoinChallenge={handleJoinChallenge}
            onViewLeaderboard={handleViewLeaderboard}
          />
        );
      
      case 'taking':
        return (
          <ChallengeTaker 
            challengeId={currentChallengeId}
            participantId={currentParticipantId}
            onComplete={handleChallengeComplete}
            onBack={() => setCurrentView('landing')}
          />
        );
      
      case 'leaderboard':
        return (
          <ChallengeLeaderboard 
            challengeId={currentChallengeId}
            onBack={handleBackToMenu}
          />
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Quiz Challenges</h2>
              <p className="text-gray-400">Create competitive quizzes and challenge your friends!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:border-purple-500 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-purple-500/20 rounded-full w-fit">
                    <Plus className="h-8 w-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Create Challenge</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 mb-4">
                    Create a new quiz challenge from your questions and share it with others
                  </p>
                  <Button 
                    onClick={handleCreateChallenge}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Challenge
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-blue-500/20 rounded-full w-fit">
                    <Trophy className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Join Challenge</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 mb-4">
                    Have a challenge link? Enter it to join and compete with others
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20"
                    onClick={() => {
                      const link = prompt('Enter challenge link or ID:');
                      if (link) {
                        const challengeId = link.includes('/challenge/') 
                          ? link.split('/challenge/')[1] 
                          : link;
                        handleViewChallenge(challengeId);
                      }
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  How Challenges Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">1</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Create</h4>
                    <p className="text-sm text-gray-400">Generate questions with ChatGPT and create a challenge</p>
                  </div>
                  <div>
                    <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-400 font-bold">2</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Share</h4>
                    <p className="text-sm text-gray-400">Copy the challenge link and share it with participants</p>
                  </div>
                  <div>
                    <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Compete</h4>
                    <p className="text-sm text-gray-400">Watch the leaderboard as participants complete the quiz</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};

export default ChallengeSection;
