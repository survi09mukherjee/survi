export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      doubt_sessions: {
        Row: {
          created_at: string
          doubt_text: string | null
          id: string
          resolution_type: string | null
          resolved: boolean | null
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doubt_text?: string | null
          id?: string
          resolution_type?: string | null
          resolved?: boolean | null
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          doubt_text?: string | null
          id?: string
          resolution_type?: string | null
          resolved?: boolean | null
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubt_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "multiplication_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      multiplication_topics: {
        Row: {
          badge_icon: string | null
          created_at: string
          description: string | null
          id: string
          level: string
          order_index: number
          title: string
          video_duration: number | null
          xp_reward: number | null
        }
        Insert: {
          badge_icon?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level: string
          order_index: number
          title: string
          video_duration?: number | null
          xp_reward?: number | null
        }
        Update: {
          badge_icon?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level?: string
          order_index?: number
          title?: string
          video_duration?: number | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          attempt_number: number | null
          created_at: string
          id: string
          passed: boolean | null
          score: number
          topic_id: string
          total_questions: number
          user_id: string
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string
          id?: string
          passed?: boolean | null
          score: number
          topic_id: string
          total_questions: number
          user_id: string
        }
        Update: {
          attempt_number?: number | null
          created_at?: string
          id?: string
          passed?: boolean | null
          score?: number
          topic_id?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "multiplication_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_avatars: {
        Row: {
          character_name: string
          character_type: string
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          tone: string
          user_id: string
        }
        Insert: {
          character_name: string
          character_type: string
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          tone: string
          user_id: string
        }
        Update: {
          character_name?: string
          character_type?: string
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          tone?: string
          user_id?: string
        }
        Relationships: []
      }
      user_multiplication_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          quiz_completed: boolean | null
          quiz_score: number | null
          revision_completed: boolean | null
          topic_id: string
          unlocked: boolean | null
          user_id: string
          video_completed: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quiz_completed?: boolean | null
          quiz_score?: number | null
          revision_completed?: boolean | null
          topic_id: string
          unlocked?: boolean | null
          user_id: string
          video_completed?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quiz_completed?: boolean | null
          quiz_score?: number | null
          revision_completed?: boolean | null
          topic_id?: string
          unlocked?: boolean | null
          user_id?: string
          video_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_multiplication_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "multiplication_topics"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
