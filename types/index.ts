export type GoalType = 'long' | 'short'
export type GoalStatus = 'active' | 'completed' | 'archived'
export type ScheduleType = 'diet' | 'exercise' | 'sleep' | 'work' | 'relax'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string
  type: GoalType
  deadline: string
  status: GoalStatus
  created_at: string
}

export interface Schedule {
  id: string
  user_id: string
  type: ScheduleType
  title: string
  start_time: string
  end_time: string
  days_of_week: number[]  // 0=周日, 1=周一...
  created_at: string
}

export interface DietLog {
  id: string
  user_id: string
  meal_type: MealType
  food_name: string
  calories: number
  date: string
  created_at: string
}

export interface FoodSuggestion {
  id: string
  name: string
  calories_per_100g: number
  category: string
}

export interface DailyTip {
  id: string
  content: string
  category: string
  created_at: string
}
