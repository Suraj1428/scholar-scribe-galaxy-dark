
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, ExternalLink, Trophy, MessageSquare } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import QuizTaker from './QuizTaker';

const QuizSection = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  
  const { getQuizSessions } = useQuiz();
  const { data: sessions, isLoading } = getQuizSessions;

  const handleOpenChatGPT = () => {
    if (!topic.trim()) return;
    
    const prompt = `Generate ${questionCount} multiple choice questions about "${topic.trim()}" with ${difficulty} difficulty level.

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "option_a": "First option",
    "option_b": "Second option", 
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": "A"
  }
]

Rules:
- Make questions relevant to the topic
- Ensure only one correct answer per question
- Make distractors plausible but clearly wrong
- Use clear, concise language
- Return only valid JSON, no extra text`;

    const encodedPrompt = encodeURIComponent(prompt);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    window.open(chatGPTUrl, '_blank');
  };

  if (activeQuizId) {
    return (
      <QuizTaker 
        sessionId={activeQuizId} 
        onComplete={() => setActiveQuizId(null)}
        onBack={() => setActiveQuizId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">AI Quiz Generator</h2>
        <p className="text-gray-400">Enter any topic and generate questions with ChatGPT</p>
      </div>

      {/* Quiz Generator Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Create New Quiz with ChatGPT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Topic
            </label>
            <Input
              placeholder="e.g., JavaScript Arrays, World War 2, Photosynthesis..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Number of Questions
              </label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleOpenChatGPT}
            disabled={!topic.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Open ChatGPT with Prompt
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">How it works:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Click the button above to open ChatGPT with your custom prompt</li>
              <li>• Copy the generated JSON questions from ChatGPT</li>
              <li>• Come back here and manually create your quiz session</li>
              <li>• No API limits or rate limiting!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Quiz Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Quizzes</h3>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : sessions && sessions.length > 0 ? (
          <div className="grid gap-4">
            {sessions.slice(0, 5).map((session) => (
              <Card key={session.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{session.topic}</h4>
                      <p className="text-sm text-gray-400">
                        {session.difficulty} • {session.total_questions} questions
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {session.completed ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <Trophy className="h-4 w-4" />
                          <span>{session.score}/{session.total_questions}</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveQuizId(session.id)}
                          className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No quizzes yet. Generate questions with ChatGPT above!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
