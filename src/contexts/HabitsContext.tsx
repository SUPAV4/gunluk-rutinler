import React, { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'

export interface Habit {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'water' | 'exercise' | 'reading' | 'meditation' | 'custom'
  difficulty: 'easy' | 'medium' | 'hard'
  streak: number
  bestStreak: number
  totalCompletions: number
  successRate: number
  createdAt: Date
  lastCompleted?: Date
  targetValue?: number
  currentValue?: number
  unit?: string
  isCompleted: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  condition: string
  isUnlocked: boolean
}

interface HabitsContextType {
  habits: Habit[]
  achievements: Achievement[]
  loading: boolean
  createHabit: (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'totalCompletions' | 'successRate' | 'createdAt' | 'isCompleted'>) => Promise<void>
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  completeHabit: (id: string, value?: number) => Promise<void>
  getHabitById: (id: string) => Habit | undefined
}

const HabitsContext = createContext<HabitsContextType | null>(null)

export const useHabits = () => {
  const context = useContext(HabitsContext)
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider')
  }
  return context
}

// Firestore keys
const HABITS_KEY = 'habits'
const ACHIEVEMENTS_KEY = 'achievements'

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'first-habit',
    title: 'İlk Adım',
    description: 'İlk rutininizi oluşturdunuz!',
    icon: '🌟',
    rarity: 'common',
    xpReward: 50,
    condition: 'create_first_habit',
    isUnlocked: false
  },
  {
    id: 'week-streak',
    title: 'Hafta Savaşçısı',
    description: '7 gün üst üste rutin tamamladınız',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 100,
    condition: 'week_streak',
    isUnlocked: false
  },
  {
    id: 'month-streak',
    title: 'Ay Ustası',
    description: '30 gün üst üste rutin tamamladınız',
    icon: '👑',
    rarity: 'epic',
    xpReward: 500,
    condition: 'month_streak',
    isUnlocked: false
  },
  {
    id: 'hundred-days',
    title: 'Yüz Gün Efsanesi',
    description: '100 gün üst üste rutin tamamladınız',
    icon: '💎',
    rarity: 'legendary',
    xpReward: 1000,
    condition: 'hundred_days',
    isUnlocked: false
  }
]

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)
  const [loading, setLoading] = useState(false)

  // Load habits from Firestore when user changes
  useEffect(() => {
    if (user) {
      const q = query(collection(db, HABITS_KEY), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const habitsData: Habit[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Habit, 'id' | 'createdAt' | 'lastCompleted'>
          habitsData.push({
            id: doc.id,
            ...data,
            createdAt: doc.data().createdAt.toDate(),
            lastCompleted: data.lastCompleted ? data.lastCompleted.toDate() : undefined
          })
        })
        setHabits(habitsData)
      })
      
      return () => unsubscribe()
    } else {
      setHabits([])
      setAchievements(defaultAchievements)
    }
  }, [user])

  // Save habits to Firestore whenever they change
  useEffect(() => {
    if (user && habits.length >= 0) {
      habits.forEach(async (habit) => {
        const habitRef = doc(db, HABITS_KEY, habit.id)
        await updateDoc(habitRef, {
          ...habit,
          userId: user.uid,
          createdAt: habit.createdAt,
          lastCompleted: habit.lastCompleted || null
        })
      })
    }
  }, [habits, user])

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    if (user && achievements.length > 0) {
      localStorage.setItem(`${ACHIEVEMENTS_KEY}-${user.uid}`, JSON.stringify(achievements))
    }
  }, [achievements, user])

  const createHabit = async (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'totalCompletions' | 'successRate' | 'createdAt' | 'isCompleted'>) => {
    if (!user) throw new Error('User not authenticated')
    
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      successRate: 0,
      createdAt: new Date(),
      isCompleted: false
    }

    setHabits(prev => [...prev, newHabit])
    
    // Check for first habit achievement
    if (habits.length === 0) {
      unlockAchievement('first-habit')
    }

    // Update user profile
    await updateUserProfile({
      totalHabits: habits.length + 1
    })

    // Save new habit to Firestore
    await addDoc(collection(db, HABITS_KEY), {
      ...newHabit,
      userId: user.uid,
      createdAt: newHabit.createdAt,
      lastCompleted: newHabit.lastCompleted || null
    })
  }

  const updateHabit = async (id: string, data: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...data } : habit
    ))

    const habitRef = doc(db, HABITS_KEY, id)
    await updateDoc(habitRef, data)
  }

  const deleteHabit = async (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id))
    
    // Update user profile
    await updateUserProfile({
      totalHabits: Math.max(0, habits.length - 1)
    })

    // Delete habit from Firestore
    const habitRef = doc(db, HABITS_KEY, id)
    await deleteDoc(habitRef)
  }

  const completeHabit = async (id: string, value?: number) => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isToday = habit.lastCompleted && 
      habit.lastCompleted.toDateString() === today.toDateString()

    if (isToday) return // Already completed today

    const wasYesterday = habit.lastCompleted && 
      habit.lastCompleted.toDateString() === yesterday.toDateString()

    const newStreak = wasYesterday ? habit.streak + 1 : 1
    const newBestStreak = Math.max(habit.bestStreak, newStreak)
    const newTotalCompletions = habit.totalCompletions + 1
    
    // Calculate success rate (simplified)
    const daysSinceCreated = Math.floor((today.getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const newSuccessRate = Math.round((newTotalCompletions / daysSinceCreated) * 100)

    const updatedHabit: Habit = {
      ...habit,
      streak: newStreak,
      bestStreak: newBestStreak,
      totalCompletions: newTotalCompletions,
      successRate: newSuccessRate,
      lastCompleted: today,
      currentValue: value || (habit.currentValue || 0) + 1,
      isCompleted: true
    }

    setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h))

    // Check for streak achievements
    if (newStreak === 7) unlockAchievement('week-streak')
    if (newStreak === 30) unlockAchievement('month-streak')
    if (newStreak === 100) unlockAchievement('hundred-days')

    // Award XP based on difficulty
    const xpReward = habit.difficulty === 'easy' ? 10 : 
                    habit.difficulty === 'medium' ? 20 : 30
    
    await updateUserProfile({
      experience: (user?.experience || 0) + xpReward,
      longestStreak: Math.max(user?.longestStreak || 0, newBestStreak)
    })

    // Update habit in Firestore
    const habitRef = doc(db, HABITS_KEY, id)
    await updateDoc(habitRef, {
      streak: newStreak,
      bestStreak: newBestStreak,
      totalCompletions: newTotalCompletions,
      successRate: newSuccessRate,
      lastCompleted: today,
      currentValue: value || (habit.currentValue || 0) + 1,
      isCompleted: true
    })
  }

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isUnlocked: true }
        : achievement
    ))

    // Award XP for achievement
    const achievement = achievements.find(a => a.id === achievementId)
    if (achievement && !achievement.isUnlocked) {
      updateUserProfile({
        experience: (user?.experience || 0) + achievement.xpReward,
        achievements: [...(user?.achievements || []), achievementId]
      })
    }
  }

  const getHabitById = (id: string) => {
    return habits.find(habit => habit.id === id)
  }

  const value: HabitsContextType = {
    habits,
    achievements,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getHabitById
  }

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  )
}