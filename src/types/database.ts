export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      matches: {
        Row: {
          id: string
          created_at: string
          date: string
          team_home: string
          team_away: string | null
          duration_minutes: number
          price: number
          screenshot_url: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          team_home: string
          team_away?: string | null
          duration_minutes: number
          price: number
          screenshot_url?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          team_home?: string
          team_away?: string | null
          duration_minutes?: number
          price?: number
          screenshot_url?: string | null
          notes?: string | null
        }
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
  }
}

export type Match = Database['public']['Tables']['matches']['Row']
export type MatchInsert = Database['public']['Tables']['matches']['Insert']
export type MatchUpdate = Database['public']['Tables']['matches']['Update']
