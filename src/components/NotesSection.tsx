
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType?: 'image' | 'pdf') => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxSize = 50 * 1024 * 1024; // 50MB limit
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }
      
      // Validate file type based on button clicked
      if (fileType === 'image' && !selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (fileType === 'pdf' && selectedFile.type !== 'application/pdf') {
        alert('Please select a PDF file');
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
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-400 text-sm">Please log in to access your notes.</p>
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
          <h2 className="text-xl font-bold text-white">Notes</h2>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-white font-semibold mb-2">Loading Notes...</h3>
            <p className="text-gray-400 text-sm">Please wait while we load your notes.</p>
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
          <h2 className="text-xl font-bold text-white">Notes</h2>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Failed to Load Notes</h3>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
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
        <h2 className="text-xl font-bold text-white">Notes</h2>
        <div className="flex items-center gap-2">
          {!isPremium && (
            <div className="text-sm text-gray-400">
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
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div>
                <Input
                  placeholder="Subject name (e.g., Mathematics, History, Science...)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <p className="text-gray-400 text-xs mt-1">Leave empty to use 'General' as subject</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Files
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'image')}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded cursor-pointer text-white text-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload Image
                  </label>
                  
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'pdf')}
                    accept="application/pdf"
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label 
                    htmlFor="pdf-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-500 rounded cursor-pointer text-white text-sm"
                  >
                    <File className="h-4 w-4" />
                    Upload PDF
                  </label>
                  
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    accept="image/*,application/pdf"
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 border border-gray-500 rounded cursor-pointer text-white text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </label>
                  
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-2">Max file size: 50MB. Supported formats: Images (JPG, PNG, GIF, etc.) and PDF files.</p>
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
                  className="border-gray-600 text-gray-300"
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
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4 overflow-x-hidden" />
              <h3 className="text-white font-semibold mb-2">No notes yet</h3>
              <p className="text-gray-400 text-sm">Create your first note to get started!</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold">{note.title}</h3>
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                        {note.subject}
                      </span>
                      {note.file_type && (
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          {note.file_type}
                        </span>
                      )}
                    </div>
                    {note.file_url && note.file_type === 'image' && (
                      <img 
                        src={note.file_url} 
                        alt={note.title}
                        className="mt-2 w-full max-w-xs rounded border border-gray-600 cursor-pointer hover:opacity-80"
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
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(note.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white ml-2"
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
