import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useHabits } from '../../contexts/HabitsContext'
import { CircularProgress } from '../UI/CircularProgress'
import { StatCard } from '../UI/StatCard'

export function DashboardView() {
  const { habits } = useHabits()
  const { userProfile } = useAuth()

  const todayStats = {
    completed: habits.filter(h => h.streak > 0).length,
    total: habits.length,
    streakSum: habits.reduce((sum, h) => sum + h.streak, 0),
    longestStreak: Math.max(...habits.map(h => h.bestStreak), 0)
  }

  const completionRate = todayStats.total > 0 ? (todayStats.completed / todayStats.total) * 100 : 0

  return (
    <motion.div 
      className="dashboard-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Today's Progress */}
      <div className="progress-card">
        <h3>Bugünün İlerlemesi</h3>
        <CircularProgress 
          percentage={completionRate}
          completed={todayStats.completed}
          total={todayStats.total}
        />
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <StatCard 
          icon="🔥" 
          value={todayStats.streakSum} 
          label="Toplam Streak" 
          index={0}
        />
        <StatCard 
          icon="🏆" 
          value={todayStats.longestStreak} 
          label="En Uzun Streak" 
          index={1}
        />
        <StatCard 
          icon="💪" 
          value={userProfile?.level || 1} 
          label="Seviye" 
          index={2}
        />
        <StatCard 
          icon="⭐" 
          value={userProfile?.achievements?.length || 0} 
          label="Başarı" 
          index={3}
        />
      </div>

      {/* Recent Habits */}
      <div className="recent-habits">
        <h3>Bugünün Rutinleri</h3>
        <div className="habits-list">
          {habits.slice(0, 5).map((habit, index) => (
            <motion.div 
              key={habit.id}
              className="habit-summary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="habit-icon" style={{ background: habit.color }}>
                {habit.icon}
              </div>
              <div className="habit-info">
                <span className="habit-name">{habit.name}</span>
                <span className="habit-streak">🔥 {habit.streak} gün</span>
              </div>
              <div className={`habit-status ${habit.streak > 0 ? 'completed' : 'pending'}`}>
                {habit.streak > 0 ? '✓' : '○'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}