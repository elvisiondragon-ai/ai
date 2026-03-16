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
      admin_activity_log: {
        Row: {
          action: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          requires_approval: boolean | null
          resource_id: string | null
          risk_score: number | null
          target_resource: string | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          requires_approval?: boolean | null
          resource_id?: string | null
          risk_score?: number | null
          target_resource?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          requires_approval?: boolean | null
          resource_id?: string | null
          risk_score?: number | null
          target_resource?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean
          role: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          is_active?: boolean
          role: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
          role?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      app_config: {
        Row: {
          created_at: string | null
          current_version: number
          force_refresh: boolean | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_version?: number
          force_refresh?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_version?: number
          force_refresh?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      app_updates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          requires_refresh: boolean | null
          title: string
          version: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          requires_refresh?: boolean | null
          title: string
          version: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          requires_refresh?: boolean | null
          title?: string
          version?: string
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: number | null
          file_path: string
          file_url: string | null
          id: string
          is_public: boolean | null
          language: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          file_path: string
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          file_path?: string
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      auth_request_logs: {
        Row: {
          component_name: string | null
          created_at: string | null
          id: number
          ip_address: unknown | null
          request_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component_name?: string | null
          created_at?: string | null
          id?: number
          ip_address?: unknown | null
          request_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component_name?: string | null
          created_at?: string | null
          id?: number
          ip_address?: unknown | null
          request_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          allowed_users: string[] | null
          channel_id: string | null
          created_at: string
          id: string
          is_private: boolean | null
          is_pro: boolean | null
          message: string
          subscription_type: string | null
          user_id: string
          user_level: number
          user_name: string
        }
        Insert: {
          allowed_users?: string[] | null
          channel_id?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          is_pro?: boolean | null
          message: string
          subscription_type?: string | null
          user_id: string
          user_level?: number
          user_name: string
        }
        Update: {
          allowed_users?: string[] | null
          channel_id?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          is_pro?: boolean | null
          message?: string
          subscription_type?: string | null
          user_id?: string
          user_level?: number
          user_name?: string
        }
        Relationships: []
      }
      data_classification: {
        Row: {
          audit_required: boolean | null
          classification: string
          created_at: string
          pii_fields: string[] | null
          retention_days: number | null
          table_name: string
        }
        Insert: {
          audit_required?: boolean | null
          classification: string
          created_at?: string
          pii_fields?: string[] | null
          retention_days?: number | null
          table_name: string
        }
        Update: {
          audit_required?: boolean | null
          classification?: string
          created_at?: string
          pii_fields?: string[] | null
          retention_days?: number | null
          table_name?: string
        }
        Relationships: []
      }
      days_remaining: {
        Row: {
          created_at: string | null
          days_remaining: number
          email: string
          id: string
          is_active: boolean | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_start_date: string | null
          subscription_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_remaining?: number
          email: string
          id?: string
          is_active?: boolean | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_start_date?: string | null
          subscription_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_remaining?: number
          email?: string
          id?: string
          is_active?: boolean | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "days_remaining_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "pro_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "days_remaining_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      debug_logs: {
        Row: {
          created_at: string | null
          error_code: string | null
          error_message: string | null
          function_name: string | null
          id: string
          parameters: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          function_name?: string | null
          id?: string
          parameters?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_code?: string | null
          error_message?: string | null
          function_name?: string | null
          id?: string
          parameters?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      device_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      elite_habits: {
        Row: {
          created_at: string
          date: string
          duration_minutes: number
          exercise_type: string
          id: string
          updated_at: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          duration_minutes: number
          exercise_type: string
          id?: string
          updated_at?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration_minutes?: number
          exercise_type?: string
          id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          ai_response: string | null
          created_at: string | null
          from_email: string | null
          id: number
          knowledge_base_id: string | null
          original_content: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          ai_response?: string | null
          created_at?: string | null
          from_email?: string | null
          id?: number
          knowledge_base_id?: string | null
          original_content?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          ai_response?: string | null
          created_at?: string | null
          from_email?: string | null
          id?: number
          knowledge_base_id?: string | null
          original_content?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          chat_notifications_enabled: boolean
          created_at: string
          id: string
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_notifications_enabled?: boolean
          created_at?: string
          id?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_notifications_enabled?: boolean
          created_at?: string
          id?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_type: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_type?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pro_subscriptions: {
        Row: {
          amount_paid: number | null
          created_at: string
          currency: string | null
          customer_phone: string | null
          days_remaining: number
          id: string
          ip_address: string | null
          pro_badge: boolean | null
          status: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_type: string
          tripay_reference: string | null
          updated_at: string
          user_email: string | null
          user_id: string | null
          verse_access: boolean | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
          days_remaining?: number
          id?: string
          ip_address?: string | null
          pro_badge?: boolean | null
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          tripay_reference?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          verse_access?: boolean | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
          days_remaining?: number
          id?: string
          ip_address?: string | null
          pro_badge?: boolean | null
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          tripay_reference?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          verse_access?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievements: string[] | null
          analytics_used: number | null
          app_version: number | null
          avatar_url: string | null
          created_at: string
          daily_xp_earned: number | null
          display_name: string | null
          experience_points: number
          id: string
          last_analytics_date: string | null
          last_login_date: string | null
          last_streak_bonus_date: string | null
          level: number
          preferred_language: string | null
          streak_days: number
          total_elite_habit: number | null
          total_journal: number | null
          total_verses: number | null
          updated_at: string
          user_email: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          analytics_used?: number | null
          app_version?: number | null
          avatar_url?: string | null
          created_at?: string
          daily_xp_earned?: number | null
          display_name?: string | null
          experience_points?: number
          id?: string
          last_analytics_date?: string | null
          last_login_date?: string | null
          last_streak_bonus_date?: string | null
          level?: number
          preferred_language?: string | null
          streak_days?: number
          total_elite_habit?: number | null
          total_journal?: number | null
          total_verses?: number | null
          updated_at?: string
          user_email: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          analytics_used?: number | null
          app_version?: number | null
          avatar_url?: string | null
          created_at?: string
          daily_xp_earned?: number | null
          display_name?: string | null
          experience_points?: number
          id?: string
          last_analytics_date?: string | null
          last_login_date?: string | null
          last_streak_bonus_date?: string | null
          level?: number
          preferred_language?: string | null
          streak_days?: number
          total_elite_habit?: number | null
          total_journal?: number | null
          total_verses?: number | null
          updated_at?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_log: {
        Row: {
          action: string
          attempts: number | null
          created_at: string | null
          id: string
          ip_address: string | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          action: string
          attempts?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          action?: string
          attempts?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      reflections: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          question: string
          reflection: string
          updated_at: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          question: string
          reflection: string
          updated_at?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          question?: string
          reflection?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          name: string
          payment_method: string | null
          payment_method_code: string | null
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days: number
          id: string
          is_active?: boolean | null
          name: string
          payment_method?: string | null
          payment_method_code?: string | null
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name?: string
          payment_method?: string | null
          payment_method_code?: string | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      user_contact_info: {
        Row: {
          created_at: string
          email_encrypted: string
          email_hash: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_encrypted: string
          email_hash: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_encrypted?: string
          email_hash?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waiting_payment: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          currency: string | null
          customer_phone: string | null
          id: string
          ip_address: string | null
          status: string | null
          subscription_type: string | null
          tripay_reference: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          customer_phone?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
          subscription_type?: string | null
          tripay_reference?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          customer_phone?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
          subscription_type?: string | null
          tripay_reference?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          activity_id: string | null
          created_at: string
          id: string
          reason: string | null
          transaction_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          transaction_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          transaction_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_pro_subscription: {
        Args: { p_payment_method?: string; p_tripay_reference: string }
        Returns: string
      }
      add_achievement: {
        Args: { achievement: string; user_id: string }
        Returns: undefined
      }
      add_pro_user_by_email: {
        Args: {
          p_duration_days?: number
          p_email: string
          p_subscription_type?: string
        }
        Returns: Json
      }
      admin_system_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      auto_expire_pro_users: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      award_audio_xp: {
        Args: {
          is_journal?: boolean
          minutes_listened?: number
          user_uuid: string
        }
        Returns: number
      }
      award_journal_xp: {
        Args: { user_uuid: string }
        Returns: number
      }
      award_xp: {
        Args: {
          p_activity_type: string
          p_metadata?: Json
          p_reason?: string
          p_user_id: string
          p_xp_amount: number
        }
        Returns: Json
      }
      award_xp_with_daily_limit: {
        Args: {
          p_activity_type: string
          p_metadata?: Json
          p_reason?: string
          p_user_id: string
          p_xp_amount: number
        }
        Returns: Json
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      calculate_correct_level: {
        Args: { exp_points: number }
        Returns: number
      }
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: number
      }
      calculate_subscription_end_date: {
        Args: { p_start_date: string; p_subscription_type: string }
        Returns: string
      }
      can_access_payment_transaction: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      can_access_verse: {
        Args: { p_user_id: string; p_verse_number: number }
        Returns: boolean
      }
      check_and_award_achievements: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      check_daily_audio_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_daily_chat_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_daily_journal_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_journal_spam_limits: {
        Args: { journal_text: string; p_user_id: string }
        Returns: Json
      }
      check_rate_limit: {
        Args: {
          p_action: string
          p_max_attempts?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_sensitive_data_rate_limit: {
        Args: { p_table_name: string; p_user_id: string }
        Returns: boolean
      }
      check_unified_pro_status: {
        Args: { p_user_id: string }
        Returns: {
          days_remaining: number
          expires_at: string
          is_pro: boolean
          pro_badge: boolean
          status: string
          subscription_type: string
          verse_access: boolean
        }[]
      }
      check_user_notification_shown: {
        Args: { p_notification_type: string; p_user_id: string }
        Returns: boolean
      }
      check_weekly_challenge_bonus: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      cleanup_chat_message_user_names: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_admin_roles: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_pro_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_waiting_payments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_user_display_names: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      confirm_payment_make_pro: {
        Args: { p_subscription_type: string; p_tripay_reference: string }
        Returns: boolean
      }
      create_chat_message: {
        Args: {
          p_allowed_users?: string[]
          p_channel_id?: string
          p_is_private?: boolean
          p_message: string
        }
        Returns: string
      }
      create_payment_with_validation: {
        Args: {
          p_payment_method: string
          p_subscription_type: string
          p_tripay_reference: string
          p_user_email: string
          p_user_full_name: string
          p_user_id: string
          p_user_phone: string
        }
        Returns: Json
      }
      create_pending_payment: {
        Args: {
          p_amount: number
          p_email: string
          p_tripay_reference: string
          p_user_id: string
        }
        Returns: string
      }
      daily_sync_days_remaining: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      decrypt_email: {
        Args: { p_encrypted_email: string }
        Returns: string
      }
      emergency_revoke_admin_role: {
        Args: { p_reason: string; p_target_user_id: string }
        Returns: Json
      }
      encrypt_email: {
        Args: { p_email: string }
        Returns: string
      }
      encrypt_payment_field: {
        Args: { p_data: string; p_field_type: string }
        Returns: string
      }
      enhanced_payment_access_control: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      expire_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fix_user_levels: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      force_global_cache_refresh: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_auth_request_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          component_name: string
          last_request: string
          request_count: number
          unique_users: number
        }[]
      }
      get_daily_xp_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_level_from_xp: {
        Args: { xp_amount: number }
        Returns: number
      }
      get_masked_payment_transaction: {
        Args: { p_transaction_id: string }
        Returns: {
          created_at: string
          currency: string
          expires_at: string
          id: string
          masked_amount: string
          paid_at: string
          payment_method: string
          status: string
          tripay_reference: string
        }[]
      }
      get_payment_access_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_count: number
          last_access: string
          suspicious_activity: boolean
          user_id: string
        }[]
      }
      get_remaining_daily_xp: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_secure_payment_transaction: {
        Args: { p_transaction_id: string }
        Returns: {
          created_at: string
          currency: string
          expires_at: string
          id: string
          masked_amount: string
          paid_at: string
          payment_method: string
          security_metadata: Json
          status: string
          tripay_reference: string
          updated_at: string
          user_id: string
        }[]
      }
      get_user_email_safe: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_email_secure: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_payment_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_payment_transactions: {
        Args: { p_limit?: number }
        Returns: {
          created_at: string
          currency: string
          expires_at: string
          id: string
          masked_amount: string
          paid_at: string
          payment_method: string
          status: string
          tripay_reference: string
        }[]
      }
      get_xp_for_next_level: {
        Args: { current_level: number }
        Returns: number
      }
      get_xp_thresholds: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      grant_admin_role: {
        Args: {
          p_expires_at?: string
          p_role: string
          p_target_user_id: string
        }
        Returns: boolean
      }
      grant_pro_status: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      handle_daily_login: {
        Args: { p_user_id: string }
        Returns: Json
      }
      has_pro_achievement: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { data: Json; uri: string } | { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { data: Json; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      increment_total_journal: {
        Args: { source_type?: string; user_id_param: string }
        Returns: undefined
      }
      increment_total_verses: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      is_super_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_verified_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      log_auth_request: {
        Args: {
          p_component_name?: string
          p_ip_address?: string
          p_request_type?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: undefined
      }
      log_data_access: {
        Args: {
          p_metadata?: Json
          p_operation: string
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
      log_sensitive_action: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_record_id?: string
          p_table_name?: string
        }
        Returns: undefined
      }
      mark_notification_type_shown: {
        Args: { p_notification_type: string; p_user_id: string }
        Returns: undefined
      }
      mask_sensitive_payment_data: {
        Args: {
          p_amount: number
          p_bank_account: string
          p_callback_data: Json
          p_moota_webhook_data: Json
          p_payment_instructions: Json
        }
        Returns: Json
      }
      process_tripay_payment_callback: {
        Args:
          | {
              p_payment_method?: string
              p_payment_status: string
              p_tripay_reference: string
            }
          | { p_payment_status: string; p_tripay_reference: string }
        Returns: Json
      }
      revoke_admin_role: {
        Args: { p_target_user_id: string }
        Returns: boolean
      }
      revoke_pro_status: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      secure_admin_role_grant: {
        Args: {
          p_expires_at?: string
          p_justification?: string
          p_role: string
          p_target_user_id: string
        }
        Returns: Json
      }
      send_chat_message: {
        Args: {
          p_allowed_users?: string[]
          p_channel_id?: string
          p_is_private?: boolean
          p_message: string
        }
        Returns: string
      }
      sync_all_days_remaining: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      sync_all_days_remaining_table: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      sync_pro_status_from_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      update_journal_tracking: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_streak: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      update_subscription_status_manually: {
        Args: {
          p_duration_type?: string
          p_status: string
          p_subscription_id: string
          p_subscription_type: string
        }
        Returns: Json
      }
      update_user_streak: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      validate_admin_role_operation: {
        Args: { p_operation: string; p_role: string; p_target_user_id: string }
        Returns: boolean
      }
      validate_journal_entry: {
        Args: { journal_text: string }
        Returns: boolean
      }
      validate_payment_access: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      validate_payment_transaction_access: {
        Args: { p_access_type?: string; p_transaction_id: string }
        Returns: boolean
      }
      verify_admin_with_failsafe: {
        Args: { p_required_role?: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
