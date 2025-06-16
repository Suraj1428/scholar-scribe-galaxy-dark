import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, ExternalLink, Trophy, MessageSquare, Upload, AlertCircle, BarChart3, BookOpen } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import QuizTaker from './QuizTaker';
import QuizAnalytics from './QuizAnalytics';
import MultiSubjectQuiz from './MultiSubjectQuiz';
import { toast } from 'sonner';

const QuizSection = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [jsonQuestions, setJsonQuestions] = useState('');
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  
  const { getQuizSessions, createQuizFromJSON } = useQuiz();
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

  const handleCreateQuizFromJSON = async () => {
    if (!jsonQuestions.trim() || !topic.trim()) {
      toast.error('Please enter both topic and JSON questions');
      return;
    }

    setIsCreatingQuiz(true);
    try {
      const questions = JSON.parse(jsonQuestions.trim());
      
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid JSON format or empty array');
      }

      // Validate question structure
      const requiredFields = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'];
      const isValid = questions.every(q => 
        requiredFields.every(field => q.hasOwnProperty(field) && q[field])
      );

      if (!isValid) {
        throw new Error('Questions are missing required fields');
      }

      const result = await createQuizFromJSON.mutateAsync({
        topic: topic.trim(),
        difficulty,
        questions
      });

      if (result.session_id) {
        setActiveQuizId(result.session_id);
        setTopic('');
        setJsonQuestions('');
        toast.success('Quiz created successfully!');
      }
    } catch (error) {
      console.error('Failed to create quiz:', error);
      toast.error('Failed to create quiz. Please check your JSON format.');
    } finally {
      setIsCreatingQuiz(false);
    }
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
        <h2 className="text-3xl font-black text-black mb-2 opacity-200">AI Quiz System</h2>
        <p className="text-lg text-black-100 font-semibold opacity-300">Create quizzes, track performance, and improve your learning</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
          <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
            <Brain className="h-4 w-4 mr-2" />
            Create Quiz
          </TabsTrigger>
          <TabsTrigger value="multi-subject" className="data-[state=active]:bg-purple-600">
            <BookOpen className="h-4 w-4 mr-2" />
            Multi-Subject
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
            <Trophy className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6 mt-6">
          {/* Quiz Generator Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl font-bold opacity-100">
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
                  <li>• Paste the JSON in the textarea below to create your quiz</li>
                  <li>• No API limits or rate limiting!</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Paste JSON Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl font-bold opacity-100">
                <Upload className="h-5 w-5 text-green-400" />
                Paste Quiz JSON from ChatGPT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quiz JSON (from ChatGPT)
                </label>
                <Textarea
                  placeholder="Paste the JSON array from ChatGPT here..."
                  value={jsonQuestions}
                  onChange={(e) => setJsonQuestions(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[200px] font-mono text-sm"
                />
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-medium mb-1">Make sure to:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Enter the topic name above</li>
                      <li>• Paste only the JSON array (starting with [ and ending with ])</li>
                      <li>• Ensure all questions have the required fields</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCreateQuizFromJSON}
                disabled={!topic.trim() || !jsonQuestions.trim() || isCreatingQuiz}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isCreatingQuiz ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Create Quiz from JSON
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multi-subject" className="mt-6">
          <MultiSubjectQuiz />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <QuizAnalytics />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {/* Recent Quiz Sessions */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 opacity-100">Quiz History</h3>
            {isLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : sessions && sessions.length > 0 ? (
              <div className="grid gap-4">
                {sessions.map((session) => (
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
                            <div className="flex items-center gap-2 text-green-400 font-medium">
                              <Trophy className="h-4 w-4" />
                              <span className="text-lg">{session.score}/{session.total_questions}</span>
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
                  <p className="text-gray-400">No quizzes yet. Create your first quiz above!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizSection;
