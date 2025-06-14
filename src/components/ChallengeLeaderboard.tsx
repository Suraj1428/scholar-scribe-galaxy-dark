
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Medal, Award, Clock, Target, Share2, Copy } from 'lucide-react';
import { useChallenge } from '@/hooks/useChallenge';
import { toast } from 'sonner';

interface ChallengeLeaderboardProps {
  challengeId: string;
  onBack: () => void;
}

const ChallengeLeaderboard = ({ challengeId, onBack }: ChallengeLeaderboardProps) => {
  const { getChallengeByLink, getChallengeLeaderboard } = useChallenge();
  const { data: challenge } = getChallengeByLink(challengeId);
  const { data: leaderboard, isLoading } = getChallengeLeaderboard(challengeId);

  const handleShareChallenge = () => {
    const link = `${window.location.origin}/challenge/${challengeId}`;
    navigator.clipboard.writeText(link);
    toast.success('Challenge link copied to clipboard!');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">{index + 1}</div>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 2:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{challenge?.title}</h2>
          <p className="text-gray-400">{challenge?.topic} • {challenge?.difficulty}</p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleShareChallenge}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Total Questions</p>
            <p className="text-xl font-bold text-white">{challenge?.total_questions}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Time Limit</p>
            <p className="text-xl font-bold text-white">{challenge?.time_limit}s per question</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Participants</p>
            <p className="text-xl font-bold text-white">{leaderboard?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading results...
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((participant, index) => (
                <div 
                  key={participant.id} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? getRankBadge(index) : 'bg-gray-700/50'
                  } ${index < 3 ? 'shadow-lg' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(index)}
                    <div>
                      <p className={`font-medium ${index < 3 ? (index === 0 ? 'text-black' : index === 1 ? 'text-black' : 'text-white') : 'text-white'}`}>
                        {participant.participant_name}
                      </p>
                      {participant.completed_at && (
                        <p className={`text-xs ${index < 3 ? (index === 0 ? 'text-black/70' : index === 1 ? 'text-black/70' : 'text-white/70') : 'text-gray-400'}`}>
                          Completed {new Date(participant.completed_at).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-lg ${index < 3 ? (index === 0 ? 'text-black' : index === 1 ? 'text-black' : 'text-white') : 'text-green-400'}`}>
                      {participant.score}/{challenge?.total_questions}
                    </div>
                    {participant.total_time > 0 && (
                      <div className={`text-sm ${index < 3 ? (index === 0 ? 'text-black/70' : index === 1 ? 'text-black/70' : 'text-white/70') : 'text-gray-400'}`}>
                        {Math.floor(participant.total_time / 60)}m {participant.total_time % 60}s
                      </div>
                    )}
                    {!participant.completed_at && (
                      <div className="text-xs text-yellow-400">In Progress</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No participants yet</p>
              <p className="text-sm">Share the challenge link to get started!</p>
              <Button 
                onClick={handleShareChallenge}
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Challenge Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeLeaderboard;
