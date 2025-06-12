
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Folder } from 'lucide-react';

const GallerySection = () => {
  const subjects = [
    { name: 'Physics', count: 24, color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop' },
    { name: 'Chemistry', count: 18, color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop' },
    { name: 'Biology', count: 32, color: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop' },
    { name: 'Mathematics', count: 15, color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop' }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gallery</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Image className="h-5 w-5" />
          <span className="text-sm">89 Images</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((subject, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors">
            <div className="relative">
              <img
                src={subject.image}
                alt={subject.name}
                className="w-full h-32 object-cover"
              />
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${subject.color}`}></div>
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{subject.name}</h3>
                  <p className="text-gray-400 text-sm">{subject.count} images</p>
                </div>
                <Folder className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-148${item}312338219-ce68d2c6f44d?w=150&h=150&fit=crop`}
                  alt={`Recent ${item}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GallerySection;
