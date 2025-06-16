import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target, 
  Award, 
  Filter,
  ChevronDown,
  Zap,
  Clock,
  Flame,
  Star,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { useHabits } from '../../contexts/HabitsContext'
import { useAuth } from '../../contexts/AuthContext'

interface PeriodOption {
  id: string
  label: string
  days: number
}

const PERIODS: PeriodOption[] = [
  { id: 'week', label: 'Son 7 Gün', days: 7 },
  { id: 'month', label: 'Son 30 Gün', days: 30 },
  { id: 'quarter', label: 'Son 3 Ay', days: 90 },
  { id: 'year', label: 'Son Yıl', days: 365 }
]

export function AnalyticsView() {
  const { habits } = useHabits()
  const { userProfile } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)

  const currentPeriod = PERIODS.find(p => p.id === selectedPeriod) || PERIODS[1]

  // Analytics hesaplamaları
  const analytics = useMemo(() => {
    const now = new Date()
    const periodStart = new Date(now.getTime() - (currentPeriod.days * 24 * 60 * 60 * 1000))
    
    // Genel istatistikler
    const totalHabits = habits.length
    const activeHabits = habits.filter(h => h.streak > 0).length
    const completedToday = habits.filter(h => {
      if (!h.lastCompleted) return false
      const today = new Date().toDateString()
      return h.lastCompleted.toDateString() === today
    }).length
    
    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0)
    const averageSuccessRate = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + h.successRate, 0) / habits.length)
      : 0
    
    const longestStreak = Math.max(...habits.map(h => h.bestStreak), 0)
    const currentTotalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
    
    // Kategori analizi
    const categoryStats = habits.reduce((acc, habit) => {
      const category = habit.category
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          completions: 0,
          averageStreak: 0,
          successRate: 0
        }
      }
      acc[category].count++
      acc[category].completions += habit.totalCompletions
      acc[category].averageStreak += habit.streak
      acc[category].successRate += habit.successRate
      return acc
    }, {} as Record<string, any>)

    // Kategori ortalamalarını hesapla
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category]
      stats.averageStreak = Math.round(stats.averageStreak / stats.count)
      stats.successRate = Math.round(stats.successRate / stats.count)
    })

    // Zorluk seviyesi analizi
    const difficultyStats = habits.reduce((acc, habit) => {
      const difficulty = habit.difficulty
      if (!acc[difficulty]) {
        acc[difficulty] = { count: 0, successRate: 0, averageStreak: 0 }
      }
      acc[difficulty].count++
      acc[difficulty].successRate += habit.successRate
      acc[difficulty].averageStreak += habit.streak
      return acc
    }, {} as Record<string, any>)

    Object.keys(difficultyStats).forEach(difficulty => {
      const stats = difficultyStats[difficulty]
      stats.successRate = Math.round(stats.successRate / stats.count)
      stats.averageStreak = Math.round(stats.averageStreak / stats.count)
    })

    // Haftalık trend (son 7 gün)
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dayName = date.toLocaleDateString('tr', { weekday: 'short' })
      
      // Bu gün için tamamlanan rutin sayısı (simülasyon)
      const completed = Math.floor(Math.random() * Math.min(totalHabits, 5)) + 
                       Math.floor(totalHabits * 0.3)
      
      return {
        day: dayName,
        date: date.toISOString().split('T')[0],
        completed,
        total: totalHabits
      }
    })

    return {
      totalHabits,
      activeHabits,
      completedToday,
      totalCompletions,
      averageSuccessRate,
      longestStreak,
      currentTotalStreak,
      categoryStats,
      difficultyStats,
      weeklyTrend,
      completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
    }
  }, [habits, currentPeriod])

  const categoryIcons = {
    water: '💧',
    exercise: '💪', 
    reading: '📚',
    meditation: '🧘',
    custom: '✨'
  }

  const categoryColors = {
    water: '#4facfe',
    exercise: '#f093fb',
    reading: '#4facfe', 
    meditation: '#43e97b',
    custom: '#fa709a'
  }

  return (
    <motion.div 
      className="analytics-view-modern"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header Section */}
      <div className="analytics-header">
        <div className="analytics-title-section">
          <motion.h1 
            className="analytics-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <BarChart3 className="title-icon" />
            Analiz & Raporlar
          </motion.h1>
          <motion.p 
            className="analytics-subtitle"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Rutinlerinizin detaylı analizi ve ilerleme raporları
          </motion.p>
        </div>

        {/* Period Selector */}
        <div className="period-selector">
          <motion.button
            className="period-btn"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="period-icon" />
            <span>{currentPeriod.label}</span>
            <ChevronDown className={`dropdown-icon ${showPeriodDropdown ? 'open' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showPeriodDropdown && (
              <motion.div
                className="period-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {PERIODS.map((period) => (
                  <button
                    key={period.id}
                    className={`period-option ${selectedPeriod === period.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPeriod(period.id)
                      setShowPeriodDropdown(false)
                    }}
                  >
                    {period.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Overview Cards */}
      <motion.div 
        className="overview-cards"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overview-card primary">
          <div className="card-icon primary">
            <Target />
          </div>
          <div className="card-content">
            <span className="card-value">{analytics.completionRate}%</span>
            <span className="card-label">Bugünkü Tamamlama</span>
            <div className="card-detail">
              {analytics.completedToday}/{analytics.totalHabits} rutin
            </div>
          </div>
          <div className="card-trend positive">
            <ArrowUp size={16} />
            +12%
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon streak">
            <Flame />
          </div>
          <div className="card-content">
            <span className="card-value">{analytics.currentTotalStreak}</span>
            <span className="card-label">Toplam Streak</span>
            <div className="card-detail">En uzun: {analytics.longestStreak} gün</div>
          </div>
          <div className="card-trend positive">
            <ArrowUp size={16} />
            +8%
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon success">
            <CheckCircle2 />
          </div>
          <div className="card-content">
            <span className="card-value">{analytics.totalCompletions}</span>
            <span className="card-label">Toplam Tamamlama</span>
            <div className="card-detail">%{analytics.averageSuccessRate} başarı oranı</div>
          </div>
          <div className="card-trend positive">
            <ArrowUp size={16} />
            +15%
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon active">
            <Activity />
          </div>
          <div className="card-content">
            <span className="card-value">{analytics.activeHabits}</span>
            <span className="card-label">Aktif Rutinler</span>
            <div className="card-detail">{analytics.totalHabits} toplam rutin</div>
          </div>
          <div className="card-trend neutral">
            <Minus size={16} />
            0%
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Weekly Trend Chart */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <h3>
              <TrendingUp className="chart-icon" />
              Haftalık Trend
            </h3>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color primary"></div>
                Tamamlanan
              </span>
              <span className="legend-item">
                <div className="legend-color secondary"></div>
                Toplam
              </span>
            </div>
          </div>
          <div className="chart-content">
            <div className="weekly-chart">
              {analytics.weeklyTrend.map((day, index) => (
                <motion.div
                  key={day.day}
                  className="chart-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.completed / day.total) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="bar-fill"></div>
                  <div className="bar-label">{day.day}</div>
                  <div className="bar-value">{day.completed}/{day.total}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Analysis */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="chart-header">
            <h3>
              <PieChart className="chart-icon" />
              Kategori Analizi
            </h3>
          </div>
          <div className="chart-content">
            <div className="category-stats">
              {Object.entries(analytics.categoryStats).map(([category, stats]: [string, any]) => (
                <motion.div
                  key={category}
                  className="category-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + Object.keys(analytics.categoryStats).indexOf(category) * 0.1 }}
                >
                  <div className="category-info">
                    <div 
                      className="category-icon"
                      style={{ background: categoryColors[category as keyof typeof categoryColors] }}
                    >
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </div>
                    <div className="category-details">
                      <span className="category-name">
                        {category === 'water' ? 'Su' : 
                         category === 'exercise' ? 'Egzersiz' :
                         category === 'reading' ? 'Okuma' :
                         category === 'meditation' ? 'Meditasyon' : 'Özel'}
                      </span>
                      <span className="category-count">{stats.count} rutin</span>
                    </div>
                  </div>
                  <div className="category-metrics">
                    <div className="metric">
                      <span className="metric-value">{stats.successRate}%</span>
                      <span className="metric-label">Başarı</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{stats.averageStreak}</span>
                      <span className="metric-label">Ort. Streak</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{stats.completions}</span>
                      <span className="metric-label">Toplam</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div 
        className="insights-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="insights-title">
          <Zap className="insights-icon" />
          Performans İçgörüleri
        </h3>
        
        <div className="insights-grid">
          <div className="insight-card achievement">
            <div className="insight-icon">
              <Trophy />
            </div>
            <div className="insight-content">
              <h4>En İyi Kategori</h4>
              <p>
                <strong>
                  {Object.entries(analytics.categoryStats).length > 0 
                    ? Object.entries(analytics.categoryStats)
                        .reduce((a, b) => a[1].successRate > b[1].successRate ? a : b)[0]
                    : 'Henüz veri yok'
                  }
                </strong> kategorisinde en yüksek başarı oranına sahipsiniz.
              </p>
            </div>
          </div>

          <div className="insight-card recommendation">
            <div className="insight-icon">
              <Star />
            </div>
            <div className="insight-content">
              <h4>Öneri</h4>
              <p>
                Günde <strong>{Math.ceil(analytics.totalHabits * 0.8)}</strong> rutini tamamlayarak 
                %80 başarı oranına ulaşabilirsiniz.
              </p>
            </div>
          </div>

          <div className="insight-card streak-info">
            <div className="insight-icon">
              <Clock />
            </div>
            <div className="insight-content">
              <h4>Streak Analizi</h4>
              <p>
                Ortalama <strong>{Math.round(analytics.currentTotalStreak / Math.max(analytics.activeHabits, 1))}</strong> günlük 
                streak'leriniz var. Harika gidiyorsunuz!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Difficulty Analysis */}
      <motion.div 
        className="difficulty-analysis"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="difficulty-title">
          <Award className="difficulty-icon" />
          Zorluk Seviyesi Analizi
        </h3>
        
        <div className="difficulty-cards">
          {Object.entries(analytics.difficultyStats).map(([difficulty, stats]: [string, any]) => (
            <motion.div
              key={difficulty}
              className={`difficulty-card ${difficulty}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + Object.keys(analytics.difficultyStats).indexOf(difficulty) * 0.1 }}
            >
              <div className="difficulty-header">
                <span className="difficulty-badge">
                  {difficulty === 'easy' && '🟢 Kolay'}
                  {difficulty === 'medium' && '🟡 Orta'}
                  {difficulty === 'hard' && '🔴 Zor'}
                </span>
                <span className="difficulty-count">{stats.count} rutin</span>
              </div>
              <div className="difficulty-stats">
                <div className="diff-stat">
                  <span className="diff-value">{stats.successRate}%</span>
                  <span className="diff-label">Başarı Oranı</span>
                </div>
                <div className="diff-stat">
                  <span className="diff-value">{stats.averageStreak}</span>
                  <span className="diff-label">Ortalama Streak</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {habits.length === 0 && (
        <motion.div 
          className="analytics-empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
              📊
            </motion.div>
          </div>
          <div className="empty-content">
            <h3>Henüz analiz edilecek veri yok</h3>
            <p>
              Rutinler oluşturmaya başladığınızda burada detaylı analizler 
              ve raporlar görebileceksiniz.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}