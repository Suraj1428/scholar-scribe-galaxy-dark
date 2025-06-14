
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Share2, Trophy, Copy, CheckCircle } from 'lucide-react';
import { useChallenge } from '@/hooks/useChallenge';
import { toast } from 'sonner';

interface ChallengeCreatorProps {
  onChallengeCreated: (challengeId: string) => void;
}

const ChallengeCreator = ({ onChallengeCreated }: ChallengeCreatorProps) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [jsonQuestions, setJsonQuestions] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  
  const { createChallenge, getUserChallenges } = useChallenge();
  const { data: userChallenges, isLoading } = getUserChallenges;

  const handleCreateChallenge = async () => {
    if (!title.trim() || !topic.trim() || !jsonQuestions.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const questions = JSON.parse(jsonQuestions.trim());
      
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid JSON format or empty array');
      }

      const result = await createChallenge.mutateAsync({
        title: title.trim(),
        topic: topic.trim(),
        difficulty,
        questions
      });

      if (result.id) {
        onChallengeCreated(result.id);
        setTitle('');
        setTopic('');
        setJsonQuestions('');
        toast.success('Challenge created! Share the link with participants.');
      }
    } catch (error) {
      console.error('Failed to create challenge:', error);
      toast.error('Failed to create challenge. Please check your JSON format.');
    }
  };

  const handleCopyLink = (challengeId: string) => {
    const link = `${window.location.origin}/challenge/${challengeId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(challengeId);
    toast.success('Challenge link copied to clipboard!');
    setTimeout(() => setCopiedLink(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Create Challenge Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Create Quiz Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Challenge Title
            </label>
            <Input
              placeholder="e.g., JavaScript Quiz Challenge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Topic
            </label>
            <Input
              placeholder="e.g., JavaScript, History, Science..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quiz Questions (JSON from ChatGPT)
            </label>
            <Textarea
              placeholder="Paste the JSON array from ChatGPT here..."
              value={jsonQuestions}
              onChange={(e) => setJsonQuestions(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleCreateChallenge}
            disabled={!title.trim() || !topic.trim() || !jsonQuestions.trim() || createChallenge.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {createChallenge.isPending ? (
              <>
                <Users className="h-4 w-4 mr-2 animate-spin" />
                Creating Challenge...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Create Challenge
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* User's Challenges */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Your Challenges</h3>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : userChallenges && userChallenges.length > 0 ? (
          <div className="grid gap-4">
            {userChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{challenge.title}</h4>
                      <p className="text-sm text-gray-400">
                        {challenge.topic} • {challenge.difficulty} • {challenge.total_questions} questions
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {new Date(challenge.created_at).toLocaleDateString()}
                      </p>
                      {!challenge.is_active && (
                        <span className="text-xs text-red-400">Inactive</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(challenge.id)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        {copiedLink === challenge.id ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChallengeCreated(challenge.id)}
                        className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No challenges created yet. Create your first challenge above!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChallengeCreator;
