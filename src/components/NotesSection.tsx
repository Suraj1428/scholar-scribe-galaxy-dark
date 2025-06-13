
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { usePremium } from '@/hooks/usePremium';

const NotesSection = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [file, setFile] = useState<File | null>(null);
  const { notes, createNote } = useNotes();
  const { isPremium } = usePremium();

  // Get existing subjects for the dropdown
  const existingSubjects = Array.from(new Set(notes.map(note => note.subject).filter(Boolean)));
  const imageNotes = notes.filter(note => note.file_type === 'image');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const result = await createNote(title, file, '', subject);
    if (result) {
      setTitle('');
      setSubject('General');
      setFile(null);
      setIsCreating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

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
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    {existingSubjects.filter(s => s !== 'General').map(subjectName => (
                      <SelectItem key={subjectName} value={subjectName}>
                        {subjectName}
                      </SelectItem>
                    ))}
                    {(isPremium || existingSubjects.length < 2) && (
                      <SelectItem value="__new__">+ Add New Subject</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
                {subject === '__new__' && (
                  <Input
                    placeholder="Enter new subject name..."
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded cursor-pointer text-white"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </label>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <ImageIcon className="h-4 w-4" />
                      {file.name}
                    </div>
                  )}
                </div>
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
                    setSubject('General');
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

      {/* Display existing notes */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
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
                        className="mt-2 max-w-xs rounded border border-gray-600"
                      />
                    )}
                    <p className="text-gray-400 text-xs">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
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
