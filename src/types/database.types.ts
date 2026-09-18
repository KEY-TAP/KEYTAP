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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          brand_id: number
          brand_name: string
          created_at: string
        }
        Insert: {
          brand_id?: number
          brand_name: string
          created_at?: string
        }
        Update: {
          brand_id?: number
          brand_name?: string
          created_at?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          created_at: string
          name: string
          preference_id: number
        }
        Insert: {
          created_at?: string
          name: string
          preference_id?: number
        }
        Update: {
          created_at?: string
          name?: string
          preference_id?: number
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          fk_product_id: number
          image_id: number
          image_url: string
          is_primary: boolean
        }
        Insert: {
          created_at?: string
          fk_product_id: number
          image_id?: number
          image_url: string
          is_primary?: boolean
        }
        Update: {
          created_at?: string
          fk_product_id?: number
          image_id?: number
          image_url?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_images_fk_product_id_fkey"
            columns: ["fk_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_preferences: {
        Row: {
          created_at: string
          fk_preference_id: number
          fk_product_id: number
          id: number
        }
        Insert: {
          created_at?: string
          fk_preference_id: number
          fk_product_id: number
          id?: number
        }
        Update: {
          created_at?: string
          fk_preference_id?: number
          fk_product_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_preferences_fk_preference_id_fkey"
            columns: ["fk_preference_id"]
            isOneToOne: false
            referencedRelation: "preferences"
            referencedColumns: ["preference_id"]
          },
          {
            foreignKeyName: "product_preferences_fk_product_id_fkey"
            columns: ["fk_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_switches: {
        Row: {
          created_at: string
          fk_product_id: number
          fk_switch_id: number
          id: number
          is_default: boolean
          option_name: string | null
        }
        Insert: {
          created_at?: string
          fk_product_id: number
          fk_switch_id: number
          id?: number
          is_default?: boolean
          option_name?: string | null
        }
        Update: {
          created_at?: string
          fk_product_id?: number
          fk_switch_id?: number
          id?: number
          is_default?: boolean
          option_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_switches_fk_product_id_fkey"
            columns: ["fk_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_switches_fk_switch_id_fkey"
            columns: ["fk_switch_id"]
            isOneToOne: false
            referencedRelation: "switches"
            referencedColumns: ["switch_id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          fk_brand_id: number
          product_id: number
          product_name: string
          product_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          fk_brand_id: number
          product_id?: number
          product_name: string
          product_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          fk_brand_id?: number
          product_id?: number
          product_name?: string
          product_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_fk_brand_id_fkey"
            columns: ["fk_brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      sounds: {
        Row: {
          created_at: string | null
          duration_sec: number | null
          fk_switch_id: number | null
          sound_id: number
          sound_type: Database["public"]["Enums"]["sound_type_enum"]
          sound_url: string
        }
        Insert: {
          created_at?: string | null
          duration_sec?: number | null
          fk_switch_id?: number | null
          sound_id?: number
          sound_type?: Database["public"]["Enums"]["sound_type_enum"]
          sound_url: string
        }
        Update: {
          created_at?: string | null
          duration_sec?: number | null
          fk_switch_id?: number | null
          sound_id?: number
          sound_type?: Database["public"]["Enums"]["sound_type_enum"]
          sound_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "sounds_fk_switch_id_fkey"
            columns: ["fk_switch_id"]
            isOneToOne: false
            referencedRelation: "switches"
            referencedColumns: ["switch_id"]
          },
        ]
      }
      switches: {
        Row: {
          created_at: string
          manufacture: string | null
          switch_id: number
          switch_name: string
          switch_type: Database["public"]["Enums"]["switch_type_enum"]
        }
        Insert: {
          created_at?: string
          manufacture?: string | null
          switch_id?: number
          switch_name: string
          switch_type?: Database["public"]["Enums"]["switch_type_enum"]
        }
        Update: {
          created_at?: string
          manufacture?: string | null
          switch_id?: number
          switch_name?: string
          switch_type?: Database["public"]["Enums"]["switch_type_enum"]
        }
        Relationships: []
      }
      user_address: {
        Row: {
          address1: string | null
          address2: string | null
          created_at: string
          fk_user_id: string
          id: number
          zip_code: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          created_at?: string
          fk_user_id: string
          id?: number
          zip_code?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          created_at?: string
          fk_user_id?: string
          id?: number
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_address_fk_user_id_fkey"
            columns: ["fk_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_agreements: {
        Row: {
          created_at: string
          fk_user_id: string
          id: number
          marketing: boolean | null
          privacy_policy: boolean
          terms_of_service: boolean
        }
        Insert: {
          created_at?: string
          fk_user_id: string
          id?: number
          marketing?: boolean | null
          privacy_policy?: boolean
          terms_of_service?: boolean
        }
        Update: {
          created_at?: string
          fk_user_id?: string
          id?: number
          marketing?: boolean | null
          privacy_policy?: boolean
          terms_of_service?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_agreements_fk_user_id_fkey"
            columns: ["fk_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_plays: {
        Row: {
          fk_product_switch_id: number
          fk_user_id: string | null
          guest_id: number | null
          id: number
          played_at: string
        }
        Insert: {
          fk_product_switch_id: number
          fk_user_id?: string | null
          guest_id?: number | null
          id?: number
          played_at?: string
        }
        Update: {
          fk_product_switch_id?: number
          fk_user_id?: string | null
          guest_id?: number | null
          id?: number
          played_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plays_fk_product_switch_id_fkey"
            columns: ["fk_product_switch_id"]
            isOneToOne: false
            referencedRelation: "product_switches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_plays_fk_user_id_fkey"
            columns: ["fk_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          fk_preference_id: number
          fk_user_id: string
          id: number
        }
        Insert: {
          created_at?: string
          fk_preference_id: number
          fk_user_id: string
          id?: number
        }
        Update: {
          created_at?: string
          fk_preference_id?: number
          fk_user_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_fk_preference_id_fkey"
            columns: ["fk_preference_id"]
            isOneToOne: false
            referencedRelation: "preferences"
            referencedColumns: ["preference_id"]
          },
          {
            foreignKeyName: "user_preferences_fk_user_id_fkey"
            columns: ["fk_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_product_likes: {
        Row: {
          created_at: string
          fk_product_id: number
          fk_user_id: string
          id: number
        }
        Insert: {
          created_at?: string
          fk_product_id: number
          fk_user_id: string
          id?: number
        }
        Update: {
          created_at?: string
          fk_product_id?: number
          fk_user_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_product_likes_fk_product_id_fkey"
            columns: ["fk_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "user_product_likes_fk_user_id_fkey"
            columns: ["fk_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          birth_date: string | null
          gender: string | null
          name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          gender?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string | null
          gender?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          signup_provider: string
          user_id: string
          user_role: string
        }
        Insert: {
          created_at?: string
          signup_provider: string
          user_id: string
          user_role?: string
        }
        Update: {
          created_at?: string
          signup_provider?: string
          user_id?: string
          user_role?: string
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
      sound_type_enum: "single" | "spacebar" | "fullversiion"
      switch_type_enum: "linear" | "tactile" | "clicky"
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
    Enums: {
      sound_type_enum: ["single", "spacebar", "fullversiion"],
      switch_type_enum: ["linear", "tactile", "clicky"],
    },
  },
} as const
