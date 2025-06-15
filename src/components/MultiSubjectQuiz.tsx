
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ExternalLink, 
  Plus, 
  X, 
  MessageSquare, 
  Upload, 
  AlertCircle,
  BookOpen,
  Award
} from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';

interface SubjectTopic {
  id: string;
  subject: string;
  topic: string;
  questionCount: number;
}

const MultiSubjectQuiz = () => {
  const [subjects, setSubjects] = useState<SubjectTopic[]>([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [jsonQuestions, setJsonQuestions] = useState('');
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  
  const { createQuizFromJSON } = useQuiz();
  const { isPremium } = usePremium();

  if (!isPremium) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Multi-Subject Quiz</h3>
          <p className="text-gray-400 mb-4">
            Upgrade to premium to create comprehensive quizzes combining multiple subjects and topics.
          </p>
          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
            Premium Feature
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const addSubject = () => {
    if (!currentSubject.trim() || !currentTopic.trim()) {
      toast.error('Please enter both subject and topic');
      return;
    }

    const newSubject: SubjectTopic = {
      id: Date.now().toString(),
      subject: currentSubject.trim(),
      topic: currentTopic.trim(),
      questionCount
    };

    setSubjects([...subjects, newSubject]);
    setCurrentSubject('');
    setCurrentTopic('');
    setQuestionCount(3);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleOpenChatGPT = () => {
    if (subjects.length === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);
    
    const subjectPrompts = subjects.map(s => 
      `${s.questionCount} questions about "${s.topic}" from ${s.subject}`
    ).join(', ');

    const prompt = `Generate a multi-subject quiz with ${totalQuestions} multiple choice questions with ${difficulty} difficulty level.

Include: ${subjectPrompts}

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "option_a": "First option",
    "option_b": "Second option", 
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": "A",
    "subject": "Subject name",
    "topic": "Topic name"
  }
]

Rules:
- Make questions relevant to each specified topic
- Ensure only one correct answer per question
- Make distractors plausible but clearly wrong
- Mix questions from all subjects
- Use clear, concise language
- Include subject and topic fields for each question
- Return only valid JSON, no extra text`;

    const encodedPrompt = encodeURIComponent(prompt);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    window.open(chatGPTUrl, '_blank');
  };

  const handleCreateQuizFromJSON = async () => {
    if (!jsonQuestions.trim()) {
      toast.error('Please enter the JSON questions from ChatGPT');
      return;
    }

    if (subjects.length === 0) {
      toast.error('Please add at least one subject');
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

      const subjectNames = subjects.map(s => s.subject).join(', ');
      const topicName = `Multi-Subject: ${subjectNames}`;

      await createQuizFromJSON.mutateAsync({
        topic: topicName,
        difficulty,
        questions
      });

      setSubjects([]);
      setJsonQuestions('');
      toast.success('Multi-subject quiz created successfully!');
    } catch (error) {
      console.error('Failed to create quiz:', error);
      toast.error('Failed to create quiz. Please check your JSON format.');
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Multi-Subject Quiz Creator</h2>
        <p className="text-gray-400">Create comprehensive quizzes combining multiple subjects</p>
      </div>

      {/* Add Subject Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-400" />
            Add Subject & Topic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <Input
                placeholder="e.g., Mathematics, Physics, Chemistry..."
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic
              </label>
              <Input
                placeholder="e.g., Algebra, Mechanics, Organic Chemistry..."
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Questions from this topic
              </label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Question</SelectItem>
                  <SelectItem value="2">2 Questions</SelectItem>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overall Difficulty
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
          </div>
          
          <Button 
            onClick={addSubject}
            disabled={!currentSubject.trim() || !currentTopic.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Added Subjects */}
      {subjects.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Quiz Subjects ({totalQuestions} total questions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-white font-medium">{subject.subject}</p>
                      <p className="text-gray-400 text-sm">{subject.topic}</p>
                    </div>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {subject.questionCount} Q
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubject(subject.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleOpenChatGPT}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Generate Questions with ChatGPT
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Paste JSON Section */}
      {subjects.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-400" />
              Paste Multi-Subject Quiz JSON
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
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Multi-Subject Quiz Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Questions will be mixed from all subjects</li>
                    <li>• Make sure JSON includes subject and topic fields</li>
                    <li>• Total questions should match your selection ({totalQuestions})</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCreateQuizFromJSON}
              disabled={!jsonQuestions.trim() || isCreatingQuiz}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isCreatingQuiz ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Creating Multi-Subject Quiz...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Multi-Subject Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiSubjectQuiz;
