
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Folder, ZoomIn, ZoomOut, RotateCcw, FileText, FileImage } from 'lucide-react';

const GallerySection = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const subjects = {
    Physics: {
      count: 24,
      color: 'bg-blue-500',
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop', title: 'Circuit Analysis' },
        { type: 'pdf', title: 'Quantum Theory Notes' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop', title: 'Lab Results' }
      ]
    },
    Chemistry: {
      count: 18,
      color: 'bg-green-500',
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop', title: 'Molecular Models' },
        { type: 'pdf', title: 'Organic Chemistry' }
      ]
    },
    Biology: {
      count: 32,
      color: 'bg-orange-500',
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop', title: 'Cell Structure' }
      ]
    },
    Mathematics: {
      count: 15,
      color: 'bg-purple-500',
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop', title: 'Calculus Graphs' }
      ]
    }
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gallery</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Image className="h-5 w-5" />
          <span className="text-sm">89 Images</span>
        </div>
      </div>

      {Object.entries(subjects).map(([subjectName, subject]) => (
        <div key={subjectName}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
            <h3 className="text-lg font-semibold text-white">{subjectName}</h3>
            <span className="text-gray-400 text-sm">({subject.count} items)</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {subject.items.map((item, index) => (
              <Card 
                key={index} 
                className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => setSelectedItem({ ...item, subject: subjectName })}
              >
                <CardContent className="p-2">
                  {item.type === 'image' ? (
                    <div className="relative">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-20 object-cover rounded"
                      />
                      <FileImage className="absolute top-1 right-1 h-3 w-3 text-blue-400" />
                    </div>
                  ) : (
                    <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
                      <FileText className="h-8 w-8 text-red-400" />
                    </div>
                  )}
                  <p className="text-white text-xs mt-1 truncate">{item.title}</p>
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
            <div>
              <h3 className="text-white font-semibold">{selectedItem.title}</h3>
              <p className="text-gray-400 text-sm">{selectedItem.subject}</p>
            </div>
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

export default GallerySection;
