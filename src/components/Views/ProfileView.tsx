import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Crown, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Star, 
  Edit3, 
  Settings, 
  Share2,
  Camera,
  Medal,
  Zap,
  Flame,
  Sparkles,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useHabits } from '../../contexts/HabitsContext'

export function ProfileView() {
  const { userProfile } = useAuth()
  const { habits } = useHabits()
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats'>('overview')
  const [isEditing, setIsEditing] = useState(false)

  // Gelişmiş istatistikler hesaplama
  const stats = {
    totalHabits: habits.length,
    activeStreak: Math.max(...habits.map(h => h.streak), 0),
    totalCompletions: habits.reduce((sum, h) => sum + (h.completions || 0), 0),
    successRate: habits.length > 0 ? Math.round(
      habits.reduce((sum, h) => sum + h.successRate, 0) / habits.length
    ) : 0,
    longestStreak: Math.max(...habits.map(h => h.bestStreak || h.streak), 0),
    level: Math.floor((userProfile?.experience || 0) / 100) + 1,
    experience: userProfile?.experience || 0,
    experienceToNext: 100 - ((userProfile?.experience || 0) % 100),
    totalDays: Math.max(...habits.map(h => 
      Math.floor((Date.now() - new Date(h.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    ), 0)
  }

  // Rozet sistemi
  const achievements = [
    { 
      id: 'first_habit', 
      name: 'İlk Adım', 
      description: 'İlk rutininizi oluşturdunuz!',
      icon: <Target className="achievement-icon" />,
      earned: stats.totalHabits >= 1,
      rarity: 'common'
    },
    { 
      id: 'streak_master', 
      name: 'Streak Ustası', 
      description: '7 günlük streak elde ettiniz!',
      icon: <Flame className="achievement-icon" />,
      earned: stats.activeStreak >= 7,
      rarity: 'rare'
    },
    { 
      id: 'habit_collector', 
      name: 'Rutin Koleksiyoncusu', 
      description: '5 farklı rutin oluşturdunuz!',
      icon: <Award className="achievement-icon" />,
      earned: stats.totalHabits >= 5,
      rarity: 'epic'
    },
    { 
      id: 'perfectionist', 
      name: 'Mükemmeliyetçi', 
      description: '%90 başarı oranına ulaştınız!',
      icon: <Crown className="achievement-icon" />,
      earned: stats.successRate >= 90,
      rarity: 'legendary'
    },
    { 
      id: 'dedication', 
      name: 'Kararlılık', 
      description: '30 günlük streak elde ettiniz!',
      icon: <Medal className="achievement-icon" />,
      earned: stats.longestStreak >= 30,
      rarity: 'legendary'
    },
    { 
      id: 'century', 
      name: 'Yüzlük Kulüp', 
      description: '100 rutin tamamladınız!',
      icon: <Trophy className="achievement-icon" />,
      earned: stats.totalCompletions >= 100,
      rarity: 'mythic'
    }
  ]

  const earnedAchievements = achievements.filter(a => a.earned)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a3b8'
      case 'rare': return '#3b82f6'
      case 'epic': return '#8b5cf6'
      case 'legendary': return '#f59e0b'
      case 'mythic': return '#ef4444'
      default: return '#94a3b8'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: <User size={18} /> },
    { id: 'achievements', name: 'Başarılar', icon: <Trophy size={18} /> },
    { id: 'stats', name: 'İstatistikler', icon: <BarChart3 size={18} /> }
  ]

  return (
    <motion.div 
      className="profile-view-modern"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-background">
          <motion.div 
            className="hero-gradient"
            animate={{ 
              background: [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="hero-pattern" />
        </div>

        <div className="hero-content">
          <motion.div 
            className="profile-avatar-container"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="avatar-wrapper">
              {userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt="Profile" 
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <span>{userProfile?.displayName?.charAt(0) || 'U'}</span>
                </div>
              )}
              <motion.button 
                className="avatar-edit-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => alert('Profil resmi değiştirme özelliği yakında!')}
              >
                <Camera size={14} />
              </motion.button>
            </div>
            
            {/* Level Badge */}
            <motion.div 
              className="level-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Crown size={12} />
              <span>Seviye {stats.level}</span>
            </motion.div>
          </motion.div>

          <div className="profile-info">
            <motion.h1 
              className="profile-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {userProfile?.displayName || 'Kullanıcı'}
              <motion.button 
                className="edit-name-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={16} />
              </motion.button>
            </motion.h1>
            
            <motion.p 
              className="profile-email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {userProfile?.email}
            </motion.p>

            {/* Experience Bar */}
            <motion.div 
              className="experience-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="experience-info">
                <span className="exp-current">{stats.experience} XP</span>
                <span className="exp-next">{stats.experienceToNext} / 100</span>
              </div>
              <div className="experience-bar">
                <motion.div 
                  className="experience-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${((stats.experience % 100) / 100) * 100}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="profile-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button 
                className="action-btn primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={16} />
                <span>Paylaş</span>
              </motion.button>
              <motion.button 
                className="action-btn secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={16} />
                <span>Ayarlar</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Quick Stats */}
            <div className="quick-stats-grid">
              <motion.div 
                className="stat-card highlight"
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="stat-icon">
                  <Flame />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.activeStreak}</span>
                  <span className="stat-label">Aktif Streak</span>
                </div>
                <div className="stat-decoration">🔥</div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="stat-icon">
                  <Target />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.totalHabits}</span>
                  <span className="stat-label">Toplam Rutin</span>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="stat-icon">
                  <TrendingUp />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.successRate}%</span>
                  <span className="stat-label">Başarı Oranı</span>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="stat-icon">
                  <Calendar />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.totalDays}</span>
                  <span className="stat-label">Toplam Gün</span>
                </div>
              </motion.div>
            </div>

            {/* Recent Achievements */}
            <div className="recent-achievements">
              <h3 className="section-title">
                <Sparkles className="title-icon" />
                Son Başarılar
              </h3>
              <div className="achievements-preview">
                {earnedAchievements.slice(0, 3).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className="achievement-card-mini"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="achievement-icon-container"
                      style={{ '--rarity-color': getRarityColor(achievement.rarity) } as React.CSSProperties}
                    >
                      {achievement.icon}
                    </div>
                    <div className="achievement-info">
                      <span className="achievement-name">{achievement.name}</span>
                      <span className="achievement-desc">{achievement.description}</span>
                    </div>
                  </motion.div>
                ))}
                
                {earnedAchievements.length > 3 && (
                  <motion.button 
                    className="view-all-btn"
                    onClick={() => setActiveTab('achievements')}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>+{earnedAchievements.length - 3} daha</span>
                    <ChevronRight size={14} />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div 
            key="achievements"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="achievements-header">
              <h3 className="section-title">
                <Trophy className="title-icon" />
                Başarılar
                <span className="achievement-count">
                  {earnedAchievements.length}/{achievements.length}
                </span>
              </h3>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(earnedAchievements.length / achievements.length) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: achievement.earned ? 1.05 : 1.02, y: -2 }}
                  style={{ '--rarity-color': getRarityColor(achievement.rarity) } as React.CSSProperties}
                >
                  <div className="achievement-header">
                    <div className="achievement-icon-large">
                      {achievement.icon}
                    </div>
                    <div className={`rarity-badge ${achievement.rarity}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  <div className="achievement-content">
                    <h4 className="achievement-title">{achievement.name}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <motion.div 
                      className="earned-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Star size={12} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div 
            key="stats"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="section-title">
              <BarChart3 className="title-icon" />
              Detaylı İstatistikler
            </h3>

            <div className="detailed-stats-grid">
              <div className="stats-group">
                <h4 className="stats-group-title">
                  <Target className="group-icon" />
                  Rutin İstatistikleri
                </h4>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">Toplam Rutin</span>
                    <span className="stat-value">{stats.totalHabits}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Toplam Tamamlama</span>
                    <span className="stat-value">{stats.totalCompletions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ortalama Başarı Oranı</span>
                    <span className="stat-value">{stats.successRate}%</span>
                  </div>
                </div>
              </div>

              <div className="stats-group">
                <h4 className="stats-group-title">
                  <Flame className="group-icon" />
                  Streak İstatistikleri
                </h4>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">Aktif Streak</span>
                    <span className="stat-value">{stats.activeStreak} gün</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">En Uzun Streak</span>
                    <span className="stat-value">{stats.longestStreak} gün</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Toplam Aktif Gün</span>
                    <span className="stat-value">{stats.totalDays} gün</span>
                  </div>
                </div>
              </div>

              <div className="stats-group">
                <h4 className="stats-group-title">
                  <Zap className="group-icon" />
                  Deneyim & Seviye
                </h4>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">Mevcut Seviye</span>
                    <span className="stat-value">Seviye {stats.level}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Toplam Deneyim</span>
                    <span className="stat-value">{stats.experience} XP</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sonraki Seviyeye</span>
                    <span className="stat-value">{stats.experienceToNext} XP</span>
                  </div>
                </div>
              </div>

              <div className="stats-group">
                <h4 className="stats-group-title">
                  <Award className="group-icon" />
                  Başarılar
                </h4>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">Kazanılan Başarı</span>
                    <span className="stat-value">{earnedAchievements.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Toplam Başarı</span>
                    <span className="stat-value">{achievements.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tamamlanma Oranı</span>
                    <span className="stat-value">
                      {Math.round((earnedAchievements.length / achievements.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}