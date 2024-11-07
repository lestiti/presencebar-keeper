import { Json } from './json';

export interface Database {
  public: {
    Tables: {
      access_codes: {
        Row: {
          id: string
          code: string
          is_active: boolean | null
          created_at: string | null
          expires_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          code: string
          is_active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          code?: string
          is_active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_logs: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance_settings: {
        Row: {
          created_at: string
          end_time: string
          id: string
          start_time: string
          synode_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          synode_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          synode_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_settings_synode_id_fkey"
            columns: ["synode_id"]
            isOneToOne: true
            referencedRelation: "synodes"
            referencedColumns: ["id"]
          }
        ]
      }
      attendances: {
        Row: {
          duration: unknown | null
          id: string
          notes: string | null
          timestamp: string
          type: string
          user_id: string
        }
        Insert: {
          duration?: unknown | null
          id?: string
          notes?: string | null
          timestamp?: string
          type: string
          user_id: string
        }
        Update: {
          duration?: unknown | null
          id?: string
          notes?: string | null
          timestamp?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ip_restrictions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          ip_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "ip_restrictions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      justified_absences: {
        Row: {
          created_at: string
          date: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "justified_absences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          function: string | null
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          synode_id: string
        }
        Insert: {
          created_at?: string
          first_name: string
          function?: string | null
          id: string
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          synode_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          function?: string | null
          id: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          synode_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_synode_id_fkey"
            columns: ["synode_id"]
            isOneToOne: false
            referencedRelation: "synodes"
            referencedColumns: ["id"]
          }
        ]
      }
      synodes: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      two_factor_auth: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          phone_number: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          phone_number?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          phone_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "two_factor_auth_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          is_active: boolean | null
          last_activity: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
      user_role: "super_admin" | "admin" | "synode_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
