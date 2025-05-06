export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category: string
          created_at: string
          id: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      podcast_categories: {
        Row: {
          category_id: number
          created_at: string
          podcast_id: number
        }
        Insert: {
          category_id: number
          created_at?: string
          podcast_id: number
        }
        Update: {
          category_id?: number
          created_at?: string
          podcast_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "podcast_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "podcast_categories_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      podcast_episode_play_history: {
        Row: {
          last_played_timestamp: string
          podcast_episode_id: number
          resume_play_time_in_seconds: number | null
          user_id: string
        }
        Insert: {
          last_played_timestamp?: string
          podcast_episode_id: number
          resume_play_time_in_seconds?: number | null
          user_id: string
        }
        Update: {
          last_played_timestamp?: string
          podcast_episode_id?: number
          resume_play_time_in_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "podcast_episode_play_history_podcast_episode_id_fkey"
            columns: ["podcast_episode_id"]
            isOneToOne: false
            referencedRelation: "podcast_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "podcast_episode_play_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      podcast_episodes: {
        Row: {
          content_url: string
          duration_in_seconds: number | null
          episode_id: number
          episode_number: number | null
          episode_title: string
          external_website_url: string | null
          id: number
          image: string
          is_explicit: boolean | null
          language: string | null
          podcast_id: number
          podcast_title: string
          publish_date_unix_timestamp: string | null
          season_number: number | null
        }
        Insert: {
          content_url: string
          duration_in_seconds?: number | null
          episode_id: number
          episode_number?: number | null
          episode_title: string
          external_website_url?: string | null
          id?: number
          image: string
          is_explicit?: boolean | null
          language?: string | null
          podcast_id: number
          podcast_title: string
          publish_date_unix_timestamp?: string | null
          season_number?: number | null
        }
        Update: {
          content_url?: string
          duration_in_seconds?: number | null
          episode_id?: number
          episode_number?: number | null
          episode_title?: string
          external_website_url?: string | null
          id?: number
          image?: string
          is_explicit?: boolean | null
          language?: string | null
          podcast_id?: number
          podcast_title?: string
          publish_date_unix_timestamp?: string | null
          season_number?: number | null
        }
        Relationships: []
      }
      podcast_followers: {
        Row: {
          created_at: string
          podcast_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          podcast_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          podcast_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "podcast_followers_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "podcast_followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      podcast_images: {
        Row: {
          created_at: string
          image_width_image_height_url: string
          storage_file_path: string
        }
        Insert: {
          created_at?: string
          image_width_image_height_url: string
          storage_file_path: string
        }
        Update: {
          created_at?: string
          image_width_image_height_url?: string
          storage_file_path?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          author: string | null
          created_at: string
          episode_count: number | null
          external_website_url: string | null
          id: number
          image: string | null
          language: string | null
          podcast_id: number
          publish_date_unix_timestamp: string | null
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          episode_count?: number | null
          external_website_url?: string | null
          id?: number
          image?: string | null
          language?: string | null
          podcast_id: number
          publish_date_unix_timestamp?: string | null
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string
          episode_count?: number | null
          external_website_url?: string | null
          id?: number
          image?: string | null
          language?: string | null
          podcast_id?: number
          publish_date_unix_timestamp?: string | null
          title?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          user_id?: string
          username?: string
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
