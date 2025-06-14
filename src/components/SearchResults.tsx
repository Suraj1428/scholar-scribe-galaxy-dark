
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Note } from '@/hooks/useNotes';

interface SearchResultsProps {
  results: Note[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const openPDF = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Search Results</h2>
        <span className="text-gray-400 text-sm">({results.length} found)</span>
      </div>

      {results.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No results found</h3>
            <p className="text-gray-400 text-sm">Try searching with different keywords</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((note) => (
            <Card key={note.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold">{note.title}</h3>
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                        {note.subject}
                      </span>
                      {note.file_type && (
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          {note.file_type}
                        </span>
                      )}
                    </div>
                    {note.file_url && note.file_type === 'image' && (
                      <img 
                        src={note.file_url} 
                        alt={note.title}
                        className="mt-2 max-w-xs rounded border border-gray-600"
                      />
                    )}
                    {note.file_url && note.file_type === 'pdf' && (
                      <div className="mt-2">
                        <Button
                          onClick={() => openPDF(note.file_url!)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <File className="h-4 w-4 mr-2" />
                          Open PDF
                        </Button>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
