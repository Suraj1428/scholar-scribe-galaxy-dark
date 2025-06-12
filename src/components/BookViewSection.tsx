
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, FileText, BookOpen } from 'lucide-react';

const BookViewSection = () => {
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const subjectContent = {
    Physics: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop', title: 'Circuit Analysis Chapter 1' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop', title: 'Quantum Mechanics Overview' },
      { type: 'pdf', title: 'Physics Lab Manual' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', title: 'Wave Properties' }
    ],
    Chemistry: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', title: 'Organic Compounds' },
      { type: 'pdf', title: 'Chemical Reactions Guide' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop', title: 'Molecular Structure' }
    ],
    Mathematics: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop', title: 'Calculus Fundamentals' },
      { type: 'pdf', title: 'Advanced Mathematics' }
    ],
    Biology: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop', title: 'Cell Biology' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop', title: 'Genetics Overview' }
    ]
  };

  const currentSubjectPages = subjectContent[selectedSubject as keyof typeof subjectContent] || [];

  const nextPage = () => {
    if (currentPage < currentSubjectPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const zoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.2, 3));
  const zoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5));
  const resetZoom = () => setZoomLevel(1);

  const changeSubject = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentPage(0);
    setZoomLevel(1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Book View</h2>
        <div className="text-gray-400 text-sm">
          Page {currentPage + 1} of {currentSubjectPages.length}
        </div>
      </div>

      {/* Subject Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.keys(subjectContent).map((subject) => (
          <Button
            key={subject}
            size="sm"
            variant={selectedSubject === subject ? "default" : "outline"}
            onClick={() => changeSubject(subject)}
            className={selectedSubject === subject 
              ? "bg-purple-600 hover:bg-purple-700 whitespace-nowrap" 
              : "border-gray-600 text-gray-300 hover:bg-gray-700 whitespace-nowrap"
            }
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {subject}
          </Button>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={zoomOut}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetZoom}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={zoomIn}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Book View */}
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative overflow-auto max-h-96 bg-gray-900">
            {currentSubjectPages.length > 0 && (
              <>
                {currentSubjectPages[currentPage].type === 'image' ? (
                  <img
                    src={currentSubjectPages[currentPage].url}
                    alt={currentSubjectPages[currentPage].title}
                    className="w-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                ) : (
                  <div className="h-96 bg-gray-700 flex flex-col items-center justify-center p-8">
                    <FileText className="h-16 w-16 text-red-400 mb-4" />
                    <h3 className="text-white text-lg mb-2">{currentSubjectPages[currentPage].title}</h3>
                    <p className="text-gray-400 text-sm">PDF Viewer</p>
                    <p className="text-gray-500 text-xs mt-1">PDF support coming soon</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Page Info */}
      {currentSubjectPages.length > 0 && (
        <div className="text-center">
          <h3 className="text-white font-medium">{currentSubjectPages[currentPage].title}</h3>
          <p className="text-gray-400 text-sm">{selectedSubject} - {currentSubjectPages[currentPage].type.toUpperCase()}</p>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentSubjectPages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentPage ? 'bg-purple-500' : 'bg-gray-600'
              }`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        <Button
          onClick={nextPage}
          disabled={currentPage === currentSubjectPages.length - 1}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default BookViewSection;
