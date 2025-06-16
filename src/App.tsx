import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Settings, User, LogOut, Trophy, BarChart3, Target, Calendar, Crown } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import { useHabits } from './contexts/HabitsContext'
import { AuthScreen } from './components/Auth/AuthScreen'
import { DashboardView } from './components/Views/DashboardView'
import { HabitsView } from './components/Views/HabitsView'
import { AnalyticsView } from './components/Views/AnalyticsView'
import { AchievementsView } from './components/Views/AchievementsView'
import { ProfileView } from './components/Views/ProfileView'

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

export default App