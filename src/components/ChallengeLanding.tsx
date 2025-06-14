
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Clock, Target, User } from 'lucide-react';
import { useChallenge } from '@/hooks/useChallenge';
import { useAuth } from '@/hooks/useAuth';

interface ChallengeLandingProps {
  challengeId: string;
  onJoinChallenge: (participantId: string) => void;
  onViewLeaderboard: () => void;
}

const ChallengeLanding = ({ challengeId, onJoinChallenge, onViewLeaderboard }: ChallengeLandingProps) => {
  const [participantName, setParticipantName] = useState('');
  const { user } = useAuth();
  const { getChallengeByLink, getChallengeLeaderboard, joinChallenge } = useChallenge();
  
  const { data: challenge, isLoading: challengeLoading } = getChallengeByLink(challengeId);
  const { data: leaderboard, isLoading: leaderboardLoading } = getChallengeLeaderboard(challengeId);

  const handleJoin = async () => {
    if (!participantName.trim()) return;
    
    try {
      const result = await joinChallenge.mutateAsync({
        challengeId,
        participantName: participantName.trim()
      });
      
      if (result.id) {
        onJoinChallenge(result.id);
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  if (challengeLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading challenge...
      </div>
    );
  }

  if (!challenge) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400 mb-4">Challenge not found or no longer active.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Challenge Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white mb-2">{challenge.title}</CardTitle>
          <p className="text-gray-400">Challenge yourself and compete with others!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Topic</p>
              <p className="font-medium text-white">{challenge.topic}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Difficulty</p>
              <p className="font-medium text-white capitalize">{challenge.difficulty}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Questions</p>
              <p className="font-medium text-white">{challenge.total_questions}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Time Limit</p>
              <p className="font-medium text-white">{challenge.time_limit}s per question</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">How it works:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Enter your name and join the challenge</li>
              <li>• Answer {challenge.total_questions} questions as quickly as possible</li>
              <li>• Your score is based on correct answers and speed</li>
              <li>• Check the leaderboard to see how you rank!</li>
            </ul>
          </div>

          {/* Join Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <Input
                placeholder={user ? user.email?.split('@')[0] || 'Your name' : 'Enter your name'}
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button 
              onClick={handleJoin}
              disabled={!participantName.trim() || joinChallenge.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
            >
              {joinChallenge.isPending ? (
                <>
                  <Users className="h-5 w-5 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Join Challenge
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Leaderboard Preview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Current Leaderboard
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewLeaderboard}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            View Full
          </Button>
        </CardHeader>
        <CardContent>
          {leaderboardLoading ? (
            <div className="text-gray-400 text-center py-4">Loading...</div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((participant, index) => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-white">{participant.participant_name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">{participant.score}/{challenge.total_questions}</div>
                    {participant.total_time > 0 && (
                      <div className="text-xs text-gray-400">{participant.total_time}s</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">
              Be the first to take this challenge!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeLanding;
