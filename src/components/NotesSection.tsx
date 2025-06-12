
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Upload, FileText, Calendar, ZoomIn, ZoomOut, RotateCcw, FileImage } from 'lucide-react';

const NotesSection = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const notesBySubject = {
    Physics: [
      { title: 'Quantum Mechanics', date: '2 hours ago', type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop' },
      { title: 'Wave Properties', date: '1 day ago', type: 'pdf', url: '#' }
    ],
    Chemistry: [
      { title: 'Organic Compounds', date: '1 day ago', type: 'image', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop' },
      { title: 'Molecular Structure', date: '2 days ago', type: 'pdf', url: '#' }
    ],
    Mathematics: [
      { title: 'Calculus Notes', date: '2 days ago', type: 'image', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop' }
    ],
    Biology: [
      { title: 'Cell Structure', date: '3 days ago', type: 'image', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop' }
    ]
  };

  const zoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.2, 3));
  const zoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5));
  const resetZoom = () => setZoomLevel(1);

  const closeViewer = () => {
    setSelectedItem(null);
    setZoomLevel(1);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Upload Notes Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Note title..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="flex gap-3">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes by Subject */}
      {Object.entries(notesBySubject).map(([subject, notes]) => (
        <div key={subject}>
          <h3 className="text-lg font-semibold text-white mb-4">{subject}</h3>
          <div className="grid grid-cols-2 gap-3">
            {notes.map((note, index) => (
              <Card 
                key={index} 
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => setSelectedItem(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {note.type === 'image' ? (
                      <FileImage className="h-5 w-5 text-blue-400" />
                    ) : (
                      <FileText className="h-5 w-5 text-red-400" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{note.title}</h4>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <Calendar className="h-3 w-3" />
                        {note.date}
                      </div>
                    </div>
                  </div>
                  {note.type === 'image' && (
                    <img 
                      src={note.url} 
                      alt={note.title}
                      className="w-full h-20 object-cover rounded mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-800">
            <h3 className="text-white font-semibold">{selectedItem.title}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={zoomOut} className="border-gray-600 text-gray-300">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={resetZoom} className="border-gray-600 text-gray-300">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={zoomIn} className="border-gray-600 text-gray-300">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={closeViewer} className="bg-red-600 hover:bg-red-700">
                Close
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {selectedItem.type === 'image' ? (
              <img 
                src={selectedItem.url} 
                alt={selectedItem.title}
                className="max-w-full h-auto mx-auto transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : (
              <div className="bg-gray-700 p-8 rounded-lg text-center">
                <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-white">PDF Viewer</p>
                <p className="text-gray-400 text-sm mt-2">PDF support coming soon</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;
