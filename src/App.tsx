import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Settings, User, LogOut, Trophy, BarChart3, Target, Calendar, Crown } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import { useHabits } from './contexts/HabitsContext'
import { AuthScreen } from './components/Auth/AuthScreen'

function App() {
  const { user, userProfile, logout } = useAuth()
  const { habits, loading } = useHabits()
  const [currentView, setCurrentView] = useState<'dashboard' | 'habits' | 'analytics' | 'achievements' | 'profile'>('dashboard')

  if (!user) {
    return <AuthScreen onComplete={() => {}} />
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="main-app">
      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="header-left">
          <div className="user-avatar">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" />
            ) : (
              <span>{userProfile?.displayName?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="user-info">
            <h2>Merhaba, {userProfile?.displayName || 'Kullanıcı'}!</h2>
            <div className="user-level">
              <Crown size={16} />
              <span>Seviye {userProfile?.level || 1}</span>
              <div className="xp-bar">
                <div 
                  className="xp-progress" 
                  style={{ width: `${((userProfile?.experience || 0) % 1000) / 10}%` }}
                />
              </div>
              <span>{(userProfile?.experience || 0) % 1000}/1000 XP</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <motion.button 
            className="header-btn"
            whileTap={{ scale: 0.95 }}
            onClick={() => logout()}
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        className="bottom-nav"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button 
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <BarChart3 size={20} />
          <span>Özet</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'habits' ? 'active' : ''}`}
          onClick={() => setCurrentView('habits')}
        >
          <Target size={20} />
          <span>Rutinler</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
          onClick={() => setCurrentView('analytics')}
        >
          <Calendar size={20} />
          <span>Analiz</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'achievements' ? 'active' : ''}`}
          onClick={() => setCurrentView('achievements')}
        >
          <Trophy size={20} />
          <span>Başarılar</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
        >
          <User size={20} />
          <span>Profil</span>
        </button>
      </motion.nav>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && <DashboardView key="dashboard" />}
          {currentView === 'habits' && <HabitsView key="habits" />}
          {currentView === 'analytics' && <AnalyticsView key="analytics" />}
          {currentView === 'achievements' && <AchievementsView key="achievements" />}
          {currentView === 'profile' && <ProfileView key="profile" />}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button 
        className="fab"
        onClick={() => setCurrentView('habits')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Plus size={24} />
      </motion.button>
    </div>
  )
}

// Dashboard View Component
function DashboardView() {
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
        <div className="circular-progress">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionRate / 100)}`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: `${2 * Math.PI * 50}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 50 * (1 - completionRate / 100)}` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="progress-text">
            <span className="percentage">{Math.round(completionRate)}%</span>
            <span className="label">{todayStats.completed}/{todayStats.total}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{todayStats.streakSum}</div>
          <div className="stat-label">Toplam Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{todayStats.longestStreak}</div>
          <div className="stat-label">En Uzun Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💪</div>
          <div className="stat-value">{userProfile?.level || 1}</div>
          <div className="stat-label">Seviye</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{userProfile?.achievements?.length || 0}</div>
          <div className="stat-label">Başarı</div>
        </div>
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

      <svg width="0" height="0">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

// Habits View Component
function HabitsView() {
  const { habits, createHabit } = useHabits()
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <motion.div 
      className="habits-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="view-header">
        <h2>Rutinlerim</h2>
        <motion.button 
          className="create-habit-btn"
          onClick={() => setShowCreateModal(true)}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Yeni Rutin
        </motion.button>
      </div>

      <div className="habits-grid">
        {habits.map((habit, index) => (
          <motion.div 
            key={habit.id}
            className="enhanced-habit-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
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
        ))}
      </div>

      {habits.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>Henüz rutin yok</h3>
          <p>İlk rutininizi oluşturarak başlayın!</p>
          <button 
            className="create-first-habit"
            onClick={() => setShowCreateModal(true)}
          >
            İlk Rutinini Oluştur
          </button>
        </div>
      )}

      {/* Create Habit Modal placeholder */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Yeni Rutin Oluştur</h3>
            <p>Gelişmiş rutin oluşturma formu burada olacak...</p>
            <button onClick={() => setShowCreateModal(false)}>Kapat</button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Analytics View Component
function AnalyticsView() {
  return (
    <motion.div 
      className="analytics-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>Analiz ve Raporlar</h2>
      <p>Detaylı analitik özellikleri burada olacak...</p>
    </motion.div>
  )
}

// Achievements View Component
function AchievementsView() {
  const { achievements } = useHabits()
  const { userProfile } = useAuth()

  return (
    <motion.div 
      className="achievements-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>Başarılar</h2>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => {
          const isUnlocked = userProfile?.achievements?.includes(achievement.id)
          return (
            <motion.div 
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : ''} ${achievement.rarity}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              <div className="achievement-xp">
                <span>⭐ {achievement.xpReward} XP</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// Profile View Component
function ProfileView() {
  const { userProfile } = useAuth()

  return (
    <motion.div 
      className="profile-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>Profil</h2>
      <div className="profile-info">
        <div className="profile-avatar">
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt="Profile" />
          ) : (
            <span>{userProfile?.displayName?.charAt(0) || 'U'}</span>
          )}
        </div>
        <h3>{userProfile?.displayName}</h3>
        <p>{userProfile?.email}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{userProfile?.level || 1}</span>
            <span className="stat-label">Seviye</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{userProfile?.experience || 0}</span>
            <span className="stat-label">Deneyim</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">{userProfile?.totalHabits || 0}</span>
            <span className="stat-label">Toplam Rutin</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default App