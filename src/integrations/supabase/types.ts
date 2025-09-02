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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          last_used_at: string
          message_count: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          last_used_at?: string
          message_count?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          last_used_at?: string
          message_count?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      custom_tasks: {
        Row: {
          ai_prompt: string | null
          category: string
          created_at: string
          description: string
          difficulty_level: number | null
          estimated_time_minutes: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_prompt?: string | null
          category: string
          created_at?: string
          description: string
          difficulty_level?: number | null
          estimated_time_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_prompt?: string | null
          category?: string
          created_at?: string
          description?: string
          difficulty_level?: number | null
          estimated_time_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_streak: number | null
          display_name: string | null
          id: string
          interests: string[] | null
          last_completion_date: string | null
          max_streak: number | null
          notification_enabled: boolean | null
          notification_time: string | null
          streak_start_date: string | null
          theme: string | null
          total_completions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          id?: string
          interests?: string[] | null
          last_completion_date?: string | null
          max_streak?: number | null
          notification_enabled?: boolean | null
          notification_time?: string | null
          streak_start_date?: string | null
          theme?: string | null
          total_completions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          id?: string
          interests?: string[] | null
          last_completion_date?: string | null
          max_streak?: number | null
          notification_enabled?: boolean | null
          notification_time?: string | null
          streak_start_date?: string | null
          theme?: string | null
          total_completions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_task_completions: {
        Row: {
          completed_at: string | null
          completed_date: string | null
          custom_task_id: string | null
          duration_minutes: number | null
          id: number
          notes: string | null
          satisfaction_level: number | null
          task_category: string | null
          task_name: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_date?: string | null
          custom_task_id?: string | null
          duration_minutes?: number | null
          id?: never
          notes?: string | null
          satisfaction_level?: number | null
          task_category?: string | null
          task_name?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_date?: string | null
          custom_task_id?: string | null
          duration_minutes?: number | null
          id?: never
          notes?: string | null
          satisfaction_level?: number | null
          task_category?: string | null
          task_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_dashboard_stats: {
        Row: {
          avg_satisfaction: number | null
          current_streak: number | null
          custom_tasks_count: number | null
          join_date: string | null
          last_completion_date: string | null
          max_streak: number | null
          streak_start_date: string | null
          total_completions: number | null
          total_duration: number | null
          unique_completion_days: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_daily_task: {
        Args: { user_uuid: string }
        Returns: {
          ai_prompt: string
          category: string
          description: string
          id: string
          image_url: string
          is_custom: boolean
          title: string
        }[]
      }
      recalculate_user_streaks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
