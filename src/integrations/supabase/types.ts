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
      analytics: {
        Row: {
          blog_id: string | null
          country: string | null
          created_at: string | null
          device: string | null
          event_type: string
          id: string
          ip_address: string | null
          related_search_id: string | null
          session_id: string
          site_name: string | null
          source: string | null
          user_agent: string | null
        }
        Insert: {
          blog_id?: string | null
          country?: string | null
          created_at?: string | null
          device?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          related_search_id?: string | null
          session_id: string
          site_name?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          blog_id?: string | null
          country?: string | null
          created_at?: string | null
          device?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          related_search_id?: string | null
          session_id?: string
          site_name?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_related_search_id_fkey"
            columns: ["related_search_id"]
            isOneToOne: false
            referencedRelation: "related_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author: string
          author_bio: string | null
          author_image: string | null
          category_id: number | null
          content: string
          created_at: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          serial_number: number | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          author_bio?: string | null
          author_image?: string | null
          category_id?: number | null
          content: string
          created_at?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          serial_number?: number | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          author_bio?: string | null
          author_image?: string | null
          category_id?: number | null
          content?: string
          created_at?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          serial_number?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          code_range: string
          created_at: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          code_range: string
          created_at?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          code_range?: string
          created_at?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      prelanding_pages: {
        Row: {
          background_color: string | null
          background_image_url: string | null
          button_color: string | null
          button_text: string | null
          button_text_color: string | null
          created_at: string
          description: string | null
          description_color: string | null
          description_font_size: number | null
          email_box_border_color: string | null
          email_box_color: string | null
          headline: string | null
          headline_color: string | null
          headline_font_size: number | null
          id: string
          image_ratio: string | null
          logo_position: string | null
          logo_size: number | null
          logo_url: string | null
          main_image_url: string | null
          related_search_id: string
          text_alignment: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          background_image_url?: string | null
          button_color?: string | null
          button_text?: string | null
          button_text_color?: string | null
          created_at?: string
          description?: string | null
          description_color?: string | null
          description_font_size?: number | null
          email_box_border_color?: string | null
          email_box_color?: string | null
          headline?: string | null
          headline_color?: string | null
          headline_font_size?: number | null
          id?: string
          image_ratio?: string | null
          logo_position?: string | null
          logo_size?: number | null
          logo_url?: string | null
          main_image_url?: string | null
          related_search_id: string
          text_alignment?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          background_image_url?: string | null
          button_color?: string | null
          button_text?: string | null
          button_text_color?: string | null
          created_at?: string
          description?: string | null
          description_color?: string | null
          description_font_size?: number | null
          email_box_border_color?: string | null
          email_box_color?: string | null
          headline?: string | null
          headline_color?: string | null
          headline_font_size?: number | null
          id?: string
          image_ratio?: string | null
          logo_position?: string | null
          logo_size?: number | null
          logo_url?: string | null
          main_image_url?: string | null
          related_search_id?: string
          text_alignment?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      related_searches: {
        Row: {
          blog_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          search_text: string
          target_url: string
        }
        Insert: {
          blog_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          search_text: string
          target_url: string
        }
        Update: {
          blog_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          search_text?: string
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_searches_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
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
