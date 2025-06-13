
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, ZoomIn, ZoomOut, RotateCcw, FileText, FileImage, X } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

const GallerySection = () => {
  const { notes, loading } = useNotes();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const groupedNotes = notes.reduce((acc, note) => {
    const subject = note.subject || 'General';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  const zoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.2, 3));
  const zoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5));
  const resetZoom = () => setZoomLevel(1);
  const closeViewer = () => {
    setSelectedItem(null);
    setZoomLevel(1);
  };

  if (loading) {
    return <div className="p-4 text-white">Loading gallery...</div>;
  }

  const totalImages = notes.filter(note => note.file_type === 'image').length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gallery</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Image className="h-5 w-5" />
          <span className="text-sm">{totalImages} Images</span>
        </div>
      </div>

      {Object.keys(groupedNotes).length === 0 ? (
        <div className="text-center py-12">
          <Image className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No images yet</h3>
          <p className="text-gray-400 text-sm">Upload some notes with images to see them here!</p>
        </div>
      ) : (
        Object.entries(groupedNotes).map(([subjectName, subjectNotes]) => (
          <div key={subjectName}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-semibold text-white">{subjectName}</h3>
              <span className="text-gray-400 text-sm">({subjectNotes.length} items)</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {subjectNotes.map((note) => (
                <Card 
                  key={note.id} 
                  className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => setSelectedItem(note)}
                >
                  <CardContent className="p-2">
                    {note.file_type === 'image' && note.file_url ? (
                      <div className="relative">
                        <img
                          src={note.file_url}
                          alt={note.title}
                          className="w-full h-20 object-cover rounded"
                        />
                        <FileImage className="absolute top-1 right-1 h-3 w-3 text-blue-400" />
                      </div>
                    ) : (
                      <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
                        <FileText className="h-8 w-8 text-red-400" />
                      </div>
                    )}
                    <p className="text-white text-xs mt-1 truncate">{note.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-800">
            <div>
              <h3 className="text-white font-semibold">{selectedItem.title}</h3>
              <p className="text-gray-400 text-sm">{selectedItem.subject}</p>
            </div>
            <div className="flex gap-2">
              {selectedItem.file_type === 'image' && (
                <>
                  <Button size="sm" variant="outline" onClick={zoomOut} className="border-gray-600 text-gray-300">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetZoom} className="border-gray-600 text-gray-300">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={zoomIn} className="border-gray-600 text-gray-300">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button size="sm" onClick={closeViewer} className="bg-red-600 hover:bg-red-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {selectedItem.file_type === 'image' && selectedItem.file_url ? (
              <img 
                src={selectedItem.file_url} 
                alt={selectedItem.title}
                className="max-w-full h-auto mx-auto transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : (
              <div className="bg-gray-700 p-8 rounded-lg text-center">
                <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-white">Document Viewer</p>
                <p className="text-gray-400 text-sm mt-2">
                  {selectedItem.file_type === 'text' ? 'Text note content' : 'File support coming soon'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
