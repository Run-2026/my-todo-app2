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
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: string
          deadline: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description?: string | null
          type?: string
          deadline?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: string
          deadline?: string | null
          status?: string
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          start_time: string
          end_time: string
          days_of_week: number[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          type?: string
          title: string
          start_time?: string
          end_time?: string
          days_of_week?: number[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          start_time?: string
          end_time?: string
          days_of_week?: number[]
          created_at?: string
        }
      }
      diet_logs: {
        Row: {
          id: string
          user_id: string
          meal_type: string
          food_name: string
          calories: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          meal_type?: string
          food_name: string
          calories: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_type?: string
          food_name?: string
          calories?: number
          date?: string
          created_at?: string
        }
      }
      food_suggestions: {
        Row: {
          id: string
          name: string
          calories_per_100g: number
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          calories_per_100g: number
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          calories_per_100g?: number
          category?: string
          created_at?: string
        }
      }
      daily_tips: {
        Row: {
          id: string
          content: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          category?: string
          created_at?: string
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
