import React from 'react'
import { motion } from 'framer-motion'

interface HabitCardProps {
  habit: {
    id: string
    name: string
    description: string
    icon: string
    color: string
    streak: number
    totalCompletions: number
    successRate: number
    difficulty: 'easy' | 'medium' | 'hard'
    bestStreak: number
  }
  index: number
  onClick?: () => void
}

export function HabitCard({ habit, index, onClick }: HabitCardProps) {
  return (
    <motion.div 
      className="enhanced-habit-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className="habit-header">
        <div className="habit-icon" style={{ background: habit.color }}>
          {habit.icon}
        </div>
        <div className="habit-difficulty">
          {habit.difficulty === 'easy' && '🟢'}
          {habit.difficulty === 'medium' && '🟡'}
          {habit.difficulty === 'hard' && '🔴'}
        </div>
      </div>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <div className="habit-stats">
        <div className="stat">
          <span className="stat-value">{habit.streak}</span>
          <span className="stat-label">Streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{habit.totalCompletions}</span>
          <span className="stat-label">Toplam</span>
        </div>
        <div className="stat">
          <span className="stat-value">{habit.successRate}%</span>
          <span className="stat-label">Başarı</span>
        </div>
      </div>
    </motion.div>
  )
}