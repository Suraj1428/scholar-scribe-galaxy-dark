
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const BookViewSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const pages = [
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setZoomLevel(Math.min(zoomLevel * 1.2, 3));
  };

  const zoomOut = () => {
    setZoomLevel(Math.max(zoomLevel / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Book View</h2>
        <div className="text-gray-400 text-sm">
          Page {currentPage + 1} of {pages.length}
        </div>
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
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="w-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
        </CardContent>
      </Card>

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
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentPage ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
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
