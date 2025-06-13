
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Calendar } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

const BookViewSection = () => {
  const { notes, loading } = useNotes();

  if (loading) {
    return <div className="p-4 text-white">Loading notes...</div>;
  }

  const groupedNotes = notes.reduce((acc, note) => {
    const subject = note.subject || 'General';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Book View</h2>
      </div>

      {Object.keys(groupedNotes).length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No notes yet</h3>
            <p className="text-gray-400 text-sm">Create some notes to see them organized by subject here!</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedNotes).map(([subject, subjectNotes]) => (
          <Card key={subject} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                {subject}
                <span className="text-gray-400 text-sm font-normal">({subjectNotes.length} notes)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjectNotes.map((note) => (
                <div key={note.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{note.title}</h4>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.created_at).toLocaleDateString()}
                      {note.file_type && (
                        <span className="px-2 py-1 bg-gray-600 rounded text-xs">
                          {note.file_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default BookViewSection;
