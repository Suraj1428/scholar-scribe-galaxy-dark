
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

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
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('notes-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const createNote = async (title: string, file?: File, content?: string) => {
    if (!user) return;

    try {
      let fileUrl = '';
      let fileType = '';

      if (file) {
        fileUrl = await uploadFile(file, user.id);
        fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
      }

      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title,
          content: content || '',
          file_url: fileUrl,
          file_type: fileType || 'text',
          subject: 'General'
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      
      // Update streak data
      await supabase
        .from('streak_data')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          uploaded: true
        });

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
    fetchNotes
  };
};
