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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      announcements: {
        Row: {
          created_date: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          tenant_id: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_date?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          tenant_id?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_date?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          tenant_id?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      course_prompts: {
        Row: {
          course_id: string
          created_at: string | null
          estimated_time_minutes: number
          id: string
          learning_goal: string
          module_name: string
          prompt_order: number
          prompt_text: string
          resources: Json | null
          tenant_id: string | null
          tips: string[] | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          estimated_time_minutes: number
          id: string
          learning_goal: string
          module_name: string
          prompt_order: number
          prompt_text: string
          resources?: Json | null
          tenant_id?: string | null
          tips?: string[] | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          estimated_time_minutes?: number
          id?: string
          learning_goal?: string
          module_name?: string
          prompt_order?: number
          prompt_text?: string
          resources?: Json | null
          tenant_id?: string | null
          tips?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_prompts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prompts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          icon_name: string | null
          id: string
          tenant_id: string | null
          title: string
          total_prompts: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          icon_name?: string | null
          id: string
          tenant_id?: string | null
          title: string
          total_prompts?: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          icon_name?: string | null
          id?: string
          tenant_id?: string | null
          title?: string
          total_prompts?: number
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_date: string | null
          discount_amount: number | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          tenant_id: string | null
          times_used: number | null
        }
        Insert: {
          code: string
          created_date?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tenant_id?: string | null
          times_used?: number | null
        }
        Update: {
          code?: string
          created_date?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tenant_id?: string | null
          times_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      example_projects: {
        Row: {
          created_date: string | null
          demo_url: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          preview_image: string | null
          source_code_url: string | null
          tags: string[] | null
          tenant_id: string | null
          title: string
        }
        Insert: {
          created_date?: string | null
          demo_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          preview_image?: string | null
          source_code_url?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          title: string
        }
        Update: {
          created_date?: string | null
          demo_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          preview_image?: string | null
          source_code_url?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "example_projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          created_date: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          projects_limit: number | null
          sort_order: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          tenant_id: string | null
        }
        Insert: {
          created_date?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          projects_limit?: number | null
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_date?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          projects_limit?: number | null
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_plans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          tenant_id: string | null
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          components: Json | null
          created_by: string | null
          created_date: string | null
          description: string | null
          id: string
          pages: Json | null
          payoff_data: Json | null
          person_data: Json | null
          pivot_data: Json | null
          plan_data: Json | null
          problem_data: Json | null
          prompt: string | null
          refined_prompt: string | null
          status: string | null
          tags: string[] | null
          tenant_id: string | null
          title: string | null
          updated_date: string | null
          user_id: string | null
          wireframe_data: Json | null
        }
        Insert: {
          components?: Json | null
          created_by?: string | null
          created_date?: string | null
          description?: string | null
          id?: string
          pages?: Json | null
          payoff_data?: Json | null
          person_data?: Json | null
          pivot_data?: Json | null
          plan_data?: Json | null
          problem_data?: Json | null
          prompt?: string | null
          refined_prompt?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          title?: string | null
          updated_date?: string | null
          user_id?: string | null
          wireframe_data?: Json | null
        }
        Update: {
          components?: Json | null
          created_by?: string | null
          created_date?: string | null
          description?: string | null
          id?: string
          pages?: Json | null
          payoff_data?: Json | null
          person_data?: Json | null
          pivot_data?: Json | null
          plan_data?: Json | null
          problem_data?: Json | null
          prompt?: string | null
          refined_prompt?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          title?: string | null
          updated_date?: string | null
          user_id?: string | null
          wireframe_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_conversations: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          messages: Json
          prompt_order: number
          tenant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id: string
          messages?: Json
          prompt_order: number
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          messages?: Json
          prompt_order?: number
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_conversations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_date: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          name: string
          prompt_template: string | null
          tags: string[] | null
          tenant_id: string | null
          thumbnail_url: string | null
        }
        Insert: {
          category?: string | null
          created_date?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          prompt_template?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          category?: string | null
          created_date?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          prompt_template?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          id: string
          joined_at: string | null
          permissions: Json | null
          role: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          role?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          role?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          slug: string
          storage_bucket: string | null
          subdomain: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          slug: string
          storage_bucket?: string | null
          subdomain?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          slug?: string
          storage_bucket?: string | null
          subdomain?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          completed_prompts: number[] | null
          course_id: string
          current_prompt_order: number
          id: string
          last_active: string | null
          started_at: string | null
          tenant_id: string | null
          total_time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_prompts?: number[] | null
          course_id: string
          current_prompt_order?: number
          id: string
          last_active?: string | null
          started_at?: string | null
          tenant_id?: string | null
          total_time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_prompts?: number[] | null
          course_id?: string
          current_prompt_order?: number
          id?: string
          last_active?: string | null
          started_at?: string | null
          tenant_id?: string | null
          total_time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          cancel_at: string | null
          created_date: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_name: string | null
          plan_tier: string | null
          projects_limit: number | null
          projects_used: number | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string | null
          updated_date: string | null
          user_email: string
          user_id: string | null
        }
        Insert: {
          cancel_at?: string | null
          created_date?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string | null
          plan_tier?: string | null
          projects_limit?: number | null
          projects_used?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string | null
          updated_date?: string | null
          user_email: string
          user_id?: string | null
        }
        Update: {
          cancel_at?: string | null
          created_date?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string | null
          plan_tier?: string | null
          projects_limit?: number | null
          projects_used?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string | null
          updated_date?: string | null
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_tenant_with_owner: {
        Args: {
          owner_user_id: string
          tenant_name: string
          tenant_slug: string
        }
        Returns: string
      }
      get_tenant_by_domain: { Args: { domain_name: string }; Returns: string }
      get_user_tenant_id: { Args: never; Returns: string }
      user_has_tenant_access: {
        Args: { tenant_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      difficulty: "beginner" | "intermediate" | "advanced"
      message_role: "user" | "assistant"
      skill_level: "beginner" | "intermediate" | "advanced"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      difficulty: ["beginner", "intermediate", "advanced"],
      message_role: ["user", "assistant"],
      skill_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
