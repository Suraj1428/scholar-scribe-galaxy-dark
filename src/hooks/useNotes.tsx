
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { usePremium } from './usePremium';

export interface Note {
  id: string;
  title: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  subject: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, userId: string) => {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('notes-files')
      .upload(fileName, file, {
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('notes-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      // First get the note to check if it has a file
      const { data: note } = await supabase
        .from('notes')
        .select('file_url')
        .eq('id', noteId)
        .eq('user_id', user.id)
        .single();

      // Delete the file from storage if it exists
      if (note?.file_url) {
        const fileName = note.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('notes-files')
            .remove([`${user.id}/${fileName}`]);
        }
      }

      // Delete the note from database
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Note Deleted",
        description: "The note has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const updateStreakData = async () => {
    if (!user) return;

    // Get current date in Indian timezone (IST)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + istOffset);
    const dateString = istDate.toISOString().split('T')[0];

    await supabase
      .from('streak_data')
      .upsert({
        user_id: user.id,
        date: dateString,
        uploaded: true
      });
  };

  const createNote = async (title: string, file?: File, content?: string, subject?: string) => {
    if (!user) return;

    try {
      // Check limits for free users
      if (!isPremium) {
        const imageNotes = notes.filter(note => note.file_type === 'image');
        const subjects = new Set(notes.map(note => note.subject)).size;
        
        if (file && file.type.startsWith('image/') && imageNotes.length >= 18) {
          toast({
            title: "Upload Limit Reached",
            description: "Free users can upload maximum 18 images. Upgrade to premium for unlimited uploads!",
            variant: "destructive",
          });
          return;
        }

        if (subject && !notes.some(note => note.subject === subject) && subjects >= 2) {
          toast({
            title: "Subject Limit Reached", 
            description: "Free users can create maximum 2 subjects. Upgrade to premium for unlimited subjects!",
            variant: "destructive",
          });
          return;
        }
      }

      let fileUrl = '';
      let fileType = '';

      if (file) {
        fileUrl = await uploadFile(file, user.id);
        if (file.type.startsWith('image/')) {
          fileType = 'image';
        } else if (file.type === 'application/pdf') {
          fileType = 'pdf';
        } else {
          fileType = 'file';
        }
      }

      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title,
          content: content || '',
          file_url: fileUrl,
          file_type: fileType || 'text',
          subject: subject || 'General'
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      
      // Update streak data with IST timezone
      await updateStreakData();

      toast({
        title: "Note Created!",
        description: `"${title}" has been saved successfully.`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  return {
    notes,
    loading,
    createNote,
    deleteNote,
    fetchNotes
  };
};
