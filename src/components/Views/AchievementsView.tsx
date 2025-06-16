import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Crown, Target, Zap, Award, Lock, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useHabits } from '../../contexts/HabitsContext'

const ACHIEVEMENT_CATEGORIES = [
  { id: 'all', name: 'Tümü', icon: Trophy },
  { id: 'streak', name: 'Streak', icon: Zap },
  { id: 'completion', name: 'Tamamlama', icon: CheckCircle },
  { id: 'milestone', name: 'Kilometre Taşı', icon: Crown },
  { id: 'special', name: 'Özel', icon: Star }
]

const RARITY_COLORS = {
  common: '#10b981',
  rare: '#3b82f6', 
  epic: '#8b5cf6',
  legendary: '#f59e0b'
}

export function AchievementsView() {
  const { achievements } = useHabits()
  const { userProfile } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAchievement, setSelectedAchievement] = useState(null)

  const unlockedAchievements = achievements.filter(a => 
    userProfile?.achievements?.includes(a.id)
  )
  
  const lockedAchievements = achievements.filter(a => 
    !userProfile?.achievements?.includes(a.id)
  )

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true
    return achievement.category === selectedCategory
  })

  const totalXP = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0)
  const completionRate = Math.round((unlockedAchievements.length / achievements.length) * 100)

  return (
    <motion.div 
      className="achievements-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header Stats */}
      <div className="achievements-header">
        <div className="header-decoration">
          <div className="trophy-icon">
            <Trophy size={32} />
          </div>
          <div className="sparkles">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="sparkle"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </div>
        </div>
        
        <h2>Başarılarım</h2>
        <p className="achievements-subtitle">Başarılarını topla, seviyeni yükselt!</p>
        
        <div className="achievement-stats">
          <div className="stat-card">
            <div className="stat-icon unlocked">
              <Award size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{unlockedAchievements.length}</span>
              <span className="stat-label">Açılan</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon locked">
              <Lock size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{lockedAchievements.length}</span>
              <span className="stat-label">Kilitli</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon xp">
              <Star size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalXP}</span>
              <span className="stat-label">Toplam XP</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completion">
              <Target size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{completionRate}%</span>
              <span className="stat-label">Tamamlama</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {ACHIEVEMENT_CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <motion.button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} />
              <span>{category.name}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement, index) => {
            const isUnlocked = userProfile?.achievements?.includes(achievement.id)
            return (
              <motion.div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedAchievement(achievement)}
                style={{
                  '--rarity-color': RARITY_COLORS[achievement.rarity]
                } as React.CSSProperties}
              >
                <div className="achievement-glow" />
                
                <div className="achievement-rarity">
                  <div className={`rarity-badge ${achievement.rarity}`}>
                    {achievement.rarity.toUpperCase()}
                  </div>
                </div>

                <div className="achievement-icon-container">
                  <div className={`achievement-icon ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    {isUnlocked ? (
                      <span className="icon-emoji">{achievement.icon}</span>
                    ) : (
                      <Lock size={24} />
                    )}
                  </div>
                  {isUnlocked && (
                    <motion.div
                      className="unlock-shine"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 100, opacity: [0, 1, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 3 
                      }}
                    />
                  )}
                </div>

                <div className="achievement-content">
                  <h4 className="achievement-title">
                    {isUnlocked ? achievement.title : '???'}
                  </h4>
                  <p className="achievement-description">
                    {isUnlocked ? achievement.description : 'Bu başarıyı açmak için devam et!'}
                  </p>
                  <div className="achievement-reward">
                    <Star size={14} />
                    <span>{achievement.xpReward} XP</span>
                  </div>
                </div>

                {isUnlocked && (
                  <motion.div
                    className="achievement-checkmark"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle size={20} />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div 
          className="empty-achievements"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-icon">🎯</div>
          <h3>Bu kategoride başarı bulunamadı</h3>
          <p>Farklı bir kategori seçmeyi deneyin!</p>
        </motion.div>
      )}

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="achievement-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="achievement-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-icon">
                  {selectedAchievement.icon}
                </div>
                <h3>{selectedAchievement.title}</h3>
                <div className={`modal-rarity-badge ${selectedAchievement.rarity}`}>
                  {selectedAchievement.rarity.toUpperCase()}
                </div>
              </div>
              
              <div className="modal-content">
                <p>{selectedAchievement.description}</p>
                <div className="modal-stats">
                  <div className="modal-stat">
                    <Star size={16} />
                    <span>{selectedAchievement.xpReward} XP Ödülü</span>
                  </div>
                  <div className="modal-stat">
                    <Trophy size={16} />
                    <span>Kategori: {selectedAchievement.category}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="modal-close"
                onClick={() => setSelectedAchievement(null)}
              >
                Kapat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}