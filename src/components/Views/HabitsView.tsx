import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Grid, List, Sparkles, Target, TrendingUp, Calendar } from 'lucide-react'
import { useHabits } from '../../contexts/HabitsContext'
import { HabitCard } from '../UI/HabitCard'
import { CreateHabitModal } from '../CreateHabitModal'

export function HabitsView() {
  const { habits, createHabit } = useHabits()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'streak' | 'name'>('recent')

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🌟', color: '#667eea' },
    { id: 'water', name: 'Su', icon: '💧', color: '#4facfe' },
    { id: 'exercise', name: 'Egzersiz', icon: '💪', color: '#f093fb' },
    { id: 'reading', name: 'Okuma', icon: '📚', color: '#4facfe' },
    { id: 'meditation', name: 'Meditasyon', icon: '🧘', color: '#43e97b' },
    { id: 'custom', name: 'Özel', icon: '✨', color: '#fa709a' }
  ]

  // Filter ve sort logic
  const filteredHabits = habits
    .filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           habit.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'streak':
          return b.streak - a.streak
        case 'name':
          return a.name.localeCompare(b.name, 'tr')
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const stats = {
    total: habits.length,
    completed: habits.filter(h => h.streak > 0).length,
    totalStreak: habits.reduce((sum, h) => sum + h.streak, 0),
    avgSuccessRate: habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.successRate, 0) / habits.length) : 0
  }

  return (
    <motion.div 
      className="habits-view-modern"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header Section */}
      <div className="habits-header">
        <div className="header-content">
          <div className="header-text">
            <motion.h1 
              className="habits-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Sparkles className="title-icon" />
              Rutinlerim
            </motion.h1>
            <motion.p 
              className="habits-subtitle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Günlük alışkanlıklarınızı takip edin ve hedeflerinize ulaşın
            </motion.p>
          </div>
          
          <motion.button 
            className="create-habit-btn-modern"
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Plus className="btn-icon" />
            <span>Yeni Rutin</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        {habits.length > 0 && (
          <motion.div 
            className="stats-cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-card">
              <div className="stat-icon">
                <Target />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Toplam Rutin</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.totalStreak}</span>
                <span className="stat-label">Toplam Streak</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.avgSuccessRate}%</span>
                <span className="stat-label">Ortalama Başarı</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls Section */}
      {habits.length > 0 && (
        <motion.div 
          className="habits-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Search Bar */}
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rutinlerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ '--category-color': category.color } as React.CSSProperties}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* View Controls */}
          <div className="view-controls">
            <div className="view-mode">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="recent">Son Eklenen</option>
              <option value="streak">Streak'e Göre</option>
              <option value="name">İsme Göre</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Habits Grid/List */}
      <div className="habits-content">
        {filteredHabits.length > 0 ? (
          <motion.div 
            className={`habits-container ${viewMode}`}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HabitCard 
                    habit={habit}
                    index={index}
                    onClick={() => console.log('Habit clicked:', habit.name)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : habits.length === 0 ? (
          // Empty State - İlk kez kullanım
          <motion.div 
            className="empty-state-modern"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="empty-illustration">
              <motion.div 
                className="empty-icon"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎯
              </motion.div>
            </div>
            
            <div className="empty-content">
              <h3 className="empty-title">İlk rutininizi oluşturun!</h3>
              <p className="empty-description">
                Günlük hedeflerinize ulaşmak için rutinler oluşturun ve 
                streak'lerinizi takip ederek motivasyonunuzu artırın.
              </p>
              
              <motion.button 
                className="create-first-habit-btn"
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="btn-icon" />
                <span>İlk Rutinini Oluştur</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // No Search Results
          <motion.div 
            className="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="no-results-icon">🔍</div>
            <h3>Aradığınız rutin bulunamadı</h3>
            <p>Farklı anahtar kelimeler deneyin veya filtrelerinizi değiştirin.</p>
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Filtreleri Temizle
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Habit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateHabitModal 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={createHabit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}