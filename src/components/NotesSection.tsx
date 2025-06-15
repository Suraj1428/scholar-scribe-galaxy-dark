
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, FileText, Image as ImageIcon, Trash2, File, AlertCircle, Loader2 } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { usePremium } from '@/hooks/usePremium';
import { useAuth } from '@/hooks/useAuth';

const NotesSection = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { notes, createNote, deleteNote, loading, error, fetchNotes } = useNotes();
  const { isPremium } = usePremium();
  const { user } = useAuth();

  const existingSubjects = Array.from(new Set(notes.map(note => note.subject).filter(Boolean)));
  const imageNotes = notes.filter(note => note.file_type === 'image');

  console.log('NotesSection render:', { 
    user: user?.id, 
    loading, 
    error, 
    notesCount: notes.length 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subjectName = subject.trim() || 'General';
    const result = await createNote(title, file, '', subjectName);
    if (result) {
      setTitle('');
      setSubject('');
      setFile(null);
      setIsCreating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxSize = 50 * 1024 * 1024; // 50MB limit
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const openPDF = (url: string) => {
    window.open(url, '_blank');
  };

  const handleRetry = () => {
    console.log('Retrying to fetch notes...');
    fetchNotes();
  };

  // Show authentication message if no user
  if (!user) {
    return (
      <div className="p-4 space-y-6">
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-gray-800 font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 text-sm">Please log in to access your notes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Notes</h2>
        </div>
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-gray-800 font-semibold mb-2">Loading Notes...</h3>
            <p className="text-gray-600 text-sm">Please wait while we load your notes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Notes</h2>
        </div>
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-gray-800 font-semibold mb-2">Failed to Load Notes</h3>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button 
              onClick={handleRetry}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Notes</h2>
        <div className="flex items-center gap-2">
          {!isPremium && (
            <div className="text-sm text-gray-600">
              Images: {imageNotes.length}/18 | Subjects: {existingSubjects.length}/2
            </div>
          )}
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card className="bg-sky-50 border-sky-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Create New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white border-sky-300 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
              
              <div>
                <Input
                  placeholder="Subject name (e.g., Mathematics, History, Science...)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white border-sky-300 text-gray-800 placeholder-gray-500"
                />
                <p className="text-gray-600 text-xs mt-1">Leave empty to use 'General' as subject</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (Image or PDF)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-sky-300 rounded cursor-pointer text-gray-800"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </label>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                      {file.name}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-xs mt-1">Max file size: 50MB</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Create Note
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setTitle('');
                    setSubject('');
                    setFile(null);
                  }}
                  className="border-sky-300 text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card className="bg-sky-50 border-sky-200">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-800 font-semibold mb-2">No notes yet</h3>
              <p className="text-gray-600 text-sm">Create your first note to get started!</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="bg-sky-50 border-sky-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-800 font-semibold">{note.title}</h3>
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                        {note.subject}
                      </span>
                      {note.file_type && (
                        <span className="px-2 py-1 bg-sky-200 text-gray-700 text-xs rounded">
                          {note.file_type}
                        </span>
                      )}
                    </div>
                    {note.file_url && note.file_type === 'image' && (
                      <img 
                        src={note.file_url} 
                        alt={note.title}
                        className="mt-2 max-w-xs rounded border border-sky-300 cursor-pointer hover:opacity-80"
                      />
                    )}
                    {note.file_url && note.file_type === 'pdf' && (
                      <div className="mt-2">
                        <Button
                          onClick={() => openPDF(note.file_url!)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <File className="h-4 w-4 mr-2" />
                          Open PDF
                        </Button>
                      </div>
                    )}
                    <p className="text-gray-600 text-xs mt-2">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(note.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;
