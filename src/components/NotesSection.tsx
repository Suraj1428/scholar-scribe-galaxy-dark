
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Upload, FileText, Calendar, ZoomIn, ZoomOut, RotateCcw, FileImage, X } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

const NotesSection = () => {
  const { notes, loading, createNote } = useNotes();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [noteTitle, setNoteTitle] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !noteTitle.trim()) return;

    await createNote(noteTitle, file);
    setNoteTitle('');
    event.target.value = '';
  };

  const createTextNote = async () => {
    if (!noteTitle.trim()) return;
    await createNote(noteTitle, undefined, '');
    setNoteTitle('');
  };

  const zoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.2, 3));
  const zoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5));
  const resetZoom = () => setZoomLevel(1);
  const closeViewer = () => {
    setSelectedItem(null);
    setZoomLevel(1);
  };

  if (loading) {
    return <div className="p-4 text-white">Loading notes...</div>;
  }

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 pb-20">
      {/* Upload Notes Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            Upload Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
          <Input
            placeholder="Note title..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              onClick={createTextNote}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
              disabled={!noteTitle.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
            <div className="flex-1">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 text-sm sm:text-base"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={!noteTitle.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Display */}
      {notes.length > 0 ? (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recent Notes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {notes.map((note) => (
              <Card 
                key={note.id} 
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => setSelectedItem(note)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    {note.file_type === 'image' ? (
                      <FileImage className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    ) : note.file_type === 'text' ? (
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    ) : (
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{note.title}</h4>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {note.file_type === 'image' && note.file_url && (
                    <img 
                      src={note.file_url} 
                      alt={note.title}
                      className="w-full h-16 sm:h-20 object-cover rounded mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 sm:p-8 text-center">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">No notes yet</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">Upload your first note to get started!</p>
          </CardContent>
        </Card>
      )}

      {/* Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-800">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate mr-4">{selectedItem.title}</h3>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              {selectedItem.file_type === 'image' && (
                <>
                  <Button size="sm" variant="outline" onClick={zoomOut} className="border-gray-600 text-gray-300 p-1 sm:p-2">
                    <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetZoom} className="border-gray-600 text-gray-300 p-1 sm:p-2">
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={zoomIn} className="border-gray-600 text-gray-300 p-1 sm:p-2">
                    <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </>
              )}
              <Button size="sm" onClick={closeViewer} className="bg-red-600 hover:bg-red-700 p-1 sm:p-2">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 sm:p-4">
            {selectedItem.file_type === 'image' && selectedItem.file_url ? (
              <img 
                src={selectedItem.file_url} 
                alt={selectedItem.title}
                className="max-w-full h-auto mx-auto transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : selectedItem.file_type === 'text' ? (
              <div className="bg-gray-700 p-4 sm:p-8 rounded-lg text-center max-w-2xl mx-auto">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-white text-lg sm:text-xl mb-4">{selectedItem.title}</h2>
                <p className="text-gray-300 text-sm">{selectedItem.content || 'No content added yet.'}</p>
              </div>
            ) : (
              <div className="bg-gray-700 p-4 sm:p-8 rounded-lg text-center max-w-2xl mx-auto">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" />
                <p className="text-white text-sm sm:text-base">PDF Viewer</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">PDF support coming soon</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;
