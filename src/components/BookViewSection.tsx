
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Calendar, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';

const BookViewSection = () => {
  const { notes, loading } = useNotes();
  const { user } = useAuth();
  const { isPremium, upgradeLoading, handleUpgrade, checkPromoCode, promoLoading } = usePremium();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  if (loading) {
    return <div className="p-4 text-white">Loading notes...</div>;
  }

  const groupedNotes = notes.reduce((acc, note) => {
    const subject = note.subject || 'General';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  const subjects = Object.keys(groupedNotes);
  const imageNotes = notes.filter(note => note.file_type === 'image');
  
  // Check limits for free users
  const isAtImageLimit = !isPremium && imageNotes.length >= 18;
  const isAtSubjectLimit = !isPremium && subjects.length >= 2;

  const handleSubjectClick = (subject: string) => {
    if (selectedSubject === subject) {
      setSelectedSubject(null);
      setCurrentImageIndex(0);
    } else {
      setSelectedSubject(subject);
      setCurrentImageIndex(0);
    }
  };

  const getSubjectImages = (subject: string) => {
    return groupedNotes[subject]?.filter(note => note.file_type === 'image') || [];
  };

  const navigateImages = (direction: 'prev' | 'next') => {
    if (!selectedSubject) return;
    
    const images = getSubjectImages(selectedSubject);
    if (images.length === 0) return;

    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    } else {
      setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      await checkPromoCode(promoCode);
      setPromoCode('');
      setShowUpgradeModal(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Book View</h2>
        {!isPremium && (
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
            <span>Images: {imageNotes.length}/18</span>
            <span>Subjects: {subjects.length}/2</span>
          </div>
        )}
      </div>

      {!isPremium && (isAtImageLimit || isAtSubjectLimit) && (
        <Card className="bg-yellow-900/20 border-yellow-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <h3 className="text-yellow-400 font-semibold">Upgrade to Premium</h3>
                <p className="text-yellow-200 text-sm">
                  You've reached the free limit. Upgrade for unlimited uploads and subjects!
                </p>
              </div>
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-black"
              >
                Upgrade ₹149
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(groupedNotes).length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No notes yet</h3>
            <p className="text-gray-400 text-sm">Create some notes to see them organized by subject here!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedNotes).map(([subject, subjectNotes]) => {
            const subjectImages = subjectNotes.filter(note => note.file_type === 'image');
            const isSelected = selectedSubject === subject;
            
            return (
              <Card key={subject} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle 
                    className="text-white flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    {subject}
                    <span className="text-gray-400 text-sm font-normal">
                      ({subjectNotes.length} notes, {subjectImages.length} images)
                    </span>
                    {subjectImages.length > 0 && (
                      <span className="text-purple-400 text-xs ml-auto">
                        Click to view images
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                
                {!isSelected && (
                  <CardContent className="space-y-3">
                    {subjectNotes.map((note) => (
                      <div key={note.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{note.title}</h4>
                          <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(note.created_at).toLocaleDateString()}
                            {note.file_type && (
                              <span className="px-2 py-1 bg-gray-600 rounded text-xs">
                                {note.file_type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}

                {isSelected && subjectImages.length > 0 && (
                  <CardContent className="p-4">
                    <div className="relative">
                      <div className="flex items-center justify-center bg-gray-900 rounded-lg min-h-[400px]">
                        <img
                          src={subjectImages[currentImageIndex]?.file_url}
                          alt={subjectImages[currentImageIndex]?.title}
                          className="max-w-full max-h-[400px] object-contain rounded"
                        />
                      </div>
                      
                      {subjectImages.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 border-gray-600 text-white hover:bg-black/70"
                            onClick={() => navigateImages('prev')}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 border-gray-600 text-white hover:bg-black/70"
                            onClick={() => navigateImages('next')}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {subjectImages.length}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <h4 className="text-white font-medium">{subjectImages[currentImageIndex]?.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(subjectImages[currentImageIndex]?.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                Upgrade to Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">₹149</div>
                <div className="text-gray-400 text-sm">One-time payment</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Unlimited image uploads
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Unlimited subjects
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Priority support
                </div>
              </div>

              <form onSubmit={handlePromoSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter promo code (SURAJ28 for free premium!)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={promoLoading}
                >
                  {promoLoading ? 'Checking...' : 'Apply Code'}
                </Button>
              </form>

              <div className="flex gap-2">
                <Button 
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black"
                >
                  {upgradeLoading ? 'Processing...' : 'Upgrade Now'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgradeModal(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookViewSection;
