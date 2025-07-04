
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

  const zoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.3, 4));
  const zoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.3, 0.3));
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
        Object.entries(groupedNotes).map(([subjectName, subjectNotes]) => {
          const imageNotes = subjectNotes.filter(note => note.file_type === 'image');
          
          if (imageNotes.length === 0) return null;

          return (
            <div key={subjectName}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h3 className="text-lg font-semibold text-white">{subjectName}</h3>
                <span className="text-gray-400 text-sm">({imageNotes.length} images)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imageNotes.map((note) => (
                  <Card 
                    key={note.id} 
                    className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => setSelectedItem(note)}
                  >
                    <CardContent className="p-2">
                      <div className="relative">
                        <img
                          src={note.file_url}
                          alt={note.title}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute top-1 right-1 bg-black/50 rounded px-1">
                          <FileImage className="h-3 w-3 text-blue-400" />
                        </div>
                      </div>
                      <p className="text-white text-xs mt-1 truncate">{note.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Enhanced Viewer Modal with Zoom */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-800">
            <div>
              <h3 className="text-white font-semibold">{selectedItem.title}</h3>
              <p className="text-gray-400 text-sm">{selectedItem.subject}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={zoomOut} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={resetZoom} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={zoomIn} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-gray-300 text-sm px-2 py-1 bg-gray-700 rounded">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button size="sm" onClick={closeViewer} className="bg-red-600 hover:bg-red-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            <div className="relative">
              <img 
                src={selectedItem.file_url} 
                alt={selectedItem.title}
                className="max-w-none transition-transform duration-200 cursor-move"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  maxWidth: zoomLevel > 1 ? 'none' : '100%',
                  maxHeight: zoomLevel > 1 ? 'none' : '100%'
                }}
                draggable={false}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Use zoom controls or scroll wheel to zoom • Click and drag to pan when zoomed
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
