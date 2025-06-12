
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Upload, FileText, Calendar } from 'lucide-react';

const NotesSection = () => {
  const recentNotes = [
    { title: 'Physics - Quantum Mechanics', subject: 'Physics', date: '2 hours ago', color: 'bg-blue-500' },
    { title: 'Chemistry - Organic Compounds', subject: 'Chemistry', date: '1 day ago', color: 'bg-green-500' },
    { title: 'Mathematics - Calculus', subject: 'Mathematics', date: '2 days ago', color: 'bg-purple-500' },
    { title: 'Biology - Cell Structure', subject: 'Biology', date: '3 days ago', color: 'bg-orange-500' }
  ];

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

      {/* Recent Notes */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Notes</h3>
        <div className="space-y-3">
          {recentNotes.map((note, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${note.color}`}></div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{note.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-gray-400 text-sm">{note.subject}</span>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Calendar className="h-3 w-3" />
                        {note.date}
                      </div>
                    </div>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
