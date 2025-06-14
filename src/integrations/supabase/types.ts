export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      challenge_answers: {
        Row: {
          answered_at: string | null
          id: string
          is_correct: boolean | null
          participant_id: string
          question_id: string
          time_taken: number | null
          user_answer: string | null
        }
        Insert: {
          answered_at?: string | null
          id?: string
          is_correct?: boolean | null
          participant_id: string
          question_id: string
          time_taken?: number | null
          user_answer?: string | null
        }
        Update: {
          answered_at?: string | null
          id?: string
          is_correct?: boolean | null
          participant_id?: string
          question_id?: string
          time_taken?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "challenge_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "challenge_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_session_id: string
          completed_at: string | null
          created_at: string
          id: string
          participant_name: string
          score: number | null
          total_time: number | null
          user_id: string | null
        }
        Insert: {
          challenge_session_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          participant_name: string
          score?: number | null
          total_time?: number | null
          user_id?: string | null
        }
        Update: {
          challenge_session_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          participant_name?: string
          score?: number | null
          total_time?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_session_id_fkey"
            columns: ["challenge_session_id"]
            isOneToOne: false
            referencedRelation: "challenge_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_questions: {
        Row: {
          challenge_session_id: string
          correct_answer: string
          created_at: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          question_order: number
        }
        Insert: {
          challenge_session_id: string
          correct_answer: string
          created_at?: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          question_order: number
        }
        Update: {
          challenge_session_id?: string
          correct_answer?: string
          created_at?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          question_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_questions_challenge_session_id_fkey"
            columns: ["challenge_session_id"]
            isOneToOne: false
            referencedRelation: "challenge_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_sessions: {
        Row: {
          created_at: string
          creator_id: string
          difficulty: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          time_limit: number | null
          title: string
          topic: string
          total_questions: number
        }
        Insert: {
          created_at?: string
          creator_id: string
          difficulty?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          time_limit?: number | null
          title: string
          topic: string
          total_questions: number
        }
        Update: {
          created_at?: string
          creator_id?: string
          difficulty?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          time_limit?: number | null
          title?: string
          topic?: string
          total_questions?: number
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string | null
          file_type: string | null
          file_url: string | null
          id: string
          subject: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          subject?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          subject?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          is_correct: boolean | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          quiz_session_id: string
          user_answer: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          quiz_session_id: string
          user_answer?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          quiz_session_id?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_session_id_fkey"
            columns: ["quiz_session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          completed: boolean | null
          created_at: string
          difficulty: string | null
          id: string
          score: number | null
          topic: string
          total_questions: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          difficulty?: string | null
          id?: string
          score?: number | null
          topic: string
          total_questions: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          difficulty?: string | null
          id?: string
          score?: number | null
          topic?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      streak_data: {
        Row: {
          date: string
          id: string
          uploaded: boolean | null
          user_id: string
        }
        Insert: {
          date: string
          id?: string
          uploaded?: boolean | null
          user_id: string
        }
        Update: {
          date?: string
          id?: string
          uploaded?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          estimated_time: string | null
          id: string
          priority: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          estimated_time?: string | null
          id?: string
          priority?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          estimated_time?: string | null
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          exam_type: string
          id: string
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_type: string
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_type?: string
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
