import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleDark: () => void
  setDark: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
  setDark: (isDark: boolean) => set({ isDark }),
}))

interface UserState {
  name: string
  email: string
  age: number
  weight: number
  height: number
  calorieGoal: number
  streak: number
  plan: string
  setGoal: (goal: number) => void
}

export const useUserStore = create<UserState>((set) => ({
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  age: 28,
  weight: 64,
  height: 165,
  calorieGoal: 2000,
  streak: 12,
  plan: 'Pro Plan',
  setGoal: (calorieGoal: number) => set({ calorieGoal }),
}))

export type FoodEntry = {
  id: string
  emoji: string
  name: string
  calories: number
  carbs: number
  protein: number
  fat: number
  portion: string
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
}

interface LogState {
  entries: FoodEntry[]
  addEntry: (entry: Omit<FoodEntry, 'id'>) => void
  removeEntry: (id: string) => void
}

// Initial mock data to match HTML
const initialEntries: FoodEntry[] = [
  { id: '1', meal: 'Breakfast', name: 'Oatmeal', emoji: '🥣', calories: 180, carbs: 32, protein: 5, fat: 3, portion: '1 bowl · 250g' },
  { id: '2', meal: 'Breakfast', name: 'Banana', emoji: '🍌', calories: 105, carbs: 27, protein: 1, fat: 0, portion: '1 medium · 118g' },
  { id: '3', meal: 'Breakfast', name: 'Black Coffee', emoji: '☕', calories: 5, carbs: 0, protein: 0, fat: 0, portion: '1 mug · 240ml' },
  { id: '4', meal: 'Lunch', name: 'Grilled Chicken Breast', emoji: '🍗', calories: 250, carbs: 0, protein: 47, fat: 5, portion: '200g' },
  { id: '5', meal: 'Lunch', name: 'Brown Rice', emoji: '🍚', calories: 200, carbs: 44, protein: 4, fat: 1.5, portion: '150g cooked' },
  { id: '6', meal: 'Lunch', name: 'Mixed Salad', emoji: '🥗', calories: 80, carbs: 8, protein: 3, fat: 5, portion: '200g' },
]

export const useFoodLogStore = create<LogState>((set) => ({
  entries: initialEntries,
  addEntry: (entry) => set((state) => ({ 
    entries: [...state.entries, { ...entry, id: Math.random().toString() }] 
  })),
  removeEntry: (id) => set((state) => ({ 
    entries: state.entries.filter(e => e.id !== id) 
  })),
}))
