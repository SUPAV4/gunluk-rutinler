import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Target, Zap, Star, Heart, BookOpen, Dumbbell, Droplets, Brain } from 'lucide-react'
import { Habit } from '../contexts/HabitsContext'

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'totalCompletions' | 'successRate' | 'createdAt' | 'isCompleted'>) => Promise<void>
}

const predefinedHabits = [
  {
    name: 'Su İçmek',
    description: 'Günde 8 bardak su iç',
    icon: '💧',
    color: '#4facfe',
    category: 'water' as const,
    difficulty: 'easy' as const,
    targetValue: 8,
    unit: 'bardak'
  },
  {
    name: 'Egzersiz Yapmak',
    description: '30 dakika spor yap',
    icon: '💪',
    color: '#f093fb',
    category: 'exercise' as const,
    difficulty: 'medium' as const,
    targetValue: 30,
    unit: 'dakika'
  },
  {
    name: 'Kitap Okumak',
    description: 'Her gün 20 sayfa oku',
    icon: '📚',
    color: '#4facfe',
    category: 'reading' as const,
    difficulty: 'easy' as const,
    targetValue: 20,
    unit: 'sayfa'
  },
  {
    name: 'Meditasyon',
    description: '10 dakika nefes egzersizi',
    icon: '🧘',
    color: '#43e97b',
    category: 'meditation' as const,
    difficulty: 'easy' as const,
    targetValue: 10,
    unit: 'dakika'
  }
]

const customIcons = [
  { icon: '🎯', label: 'Hedef' },
  { icon: '💪', label: 'Güç' },
  { icon: '📚', label: 'Bilgi' },
  { icon: '🧘', label: 'Huzur' },
  { icon: '💧', label: 'Su' },
  { icon: '🏃', label: 'Koşu' },
  { icon: '🍎', label: 'Sağlık' },
  { icon: '🎨', label: 'Sanat' },
  { icon: '🎵', label: 'Müzik' },
  { icon: '💡', label: 'Fikir' },
  { icon: '🌱', label: 'Büyüme' },
  { icon: '⭐', label: 'Yıldız' }
]

const colors = [
  '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b',
  '#fa709a', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
]

export function CreateHabitModal({ isOpen, onClose, onSubmit }: CreateHabitModalProps) {
  const [step, setStep] = useState<'template' | 'custom'>('template')
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎯',
    color: '#667eea',
    category: 'custom' as const,
    difficulty: 'medium' as const,
    targetValue: 1,
    unit: ''
  })

  const handleTemplateSelect = (template: typeof predefinedHabits[0]) => {
    setFormData({
      ...template,
      category: template.category
    })
    setStep('custom')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        category: formData.category,
        difficulty: formData.difficulty,
        targetValue: formData.targetValue,
        unit: formData.unit,
        currentValue: 0
      })
      onClose()
      // Reset form
      setFormData({
        name: '',
        description: '',
        icon: '🎯',
        color: '#667eea',
        category: 'custom',
        difficulty: 'medium',
        targetValue: 1,
        unit: ''
      })
      setStep('template')
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="create-habit-modal"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <Sparkles className="modal-icon" />
            <h2 className="modal-title">
              {step === 'template' ? 'Rutin Şablonu Seç' : 'Rutinini Özelleştir'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {step === 'template' ? (
            <motion.div 
              className="template-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="template-description">
                Hızlı başlamak için hazır şablonlardan birini seçin veya özel rutininizi oluşturun.
              </p>
              
              <div className="templates-grid">
                {predefinedHabits.map((template, index) => (
                  <motion.button
                    key={template.name}
                    className="template-card"
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="template-icon" style={{ background: template.color }}>
                      {template.icon}
                    </div>
                    <h3 className="template-name">{template.name}</h3>
                    <p className="template-desc">{template.description}</p>
                    <span className={`difficulty-badge ${template.difficulty}`}>
                      {template.difficulty === 'easy' && '🟢 Kolay'}
                      {template.difficulty === 'medium' && '🟡 Orta'}
                      {template.difficulty === 'hard' && '🔴 Zor'}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="custom-option">
                <motion.button
                  className="custom-btn"
                  onClick={() => setStep('custom')}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Star className="custom-icon" />
                  <span>Özel Rutin Oluştur</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              className="custom-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Back Button */}
              <button
                type="button"
                className="back-btn"
                onClick={() => setStep('template')}
              >
                ← Şablonlara Dön
              </button>

              {/* Form Fields */}
              <div className="form-group">
                <label className="form-label">Rutin Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Örn: Günlük egzersiz"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Bu rutininizle ilgili kısa bir açıklama..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              {/* Icon Selection */}
              <div className="form-group">
                <label className="form-label">İkon Seç</label>
                <div className="icon-grid">
                  {customIcons.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      className={`icon-btn ${formData.icon === item.icon ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, icon: item.icon }))}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="form-group">
                <label className="form-label">Renk Seç</label>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-btn ${formData.color === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    >
                      {formData.color === color && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="form-select"
                >
                  <option value="custom">Özel</option>
                  <option value="water">Su</option>
                  <option value="exercise">Egzersiz</option>
                  <option value="reading">Okuma</option>
                  <option value="meditation">Meditasyon</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="form-group">
                <label className="form-label">Zorluk</label>
                <div className="difficulty-buttons">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      className={`difficulty-btn ${formData.difficulty === diff ? 'active' : ''} ${diff}`}
                      onClick={() => setFormData(prev => ({ ...prev, difficulty: diff as any }))}
                    >
                      {diff === 'easy' && '🟢 Kolay'}
                      {diff === 'medium' && '🟡 Orta'}
                      {diff === 'hard' && '🔴 Zor'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target & Unit */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hedef</label>
                  <input
                    type="number"
                    value={formData.targetValue}
                    onChange={e => setFormData(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 1 }))}
                    className="form-input"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Birim</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="dakika, sayfa, bardak..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading || !formData.name.trim()}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Target size={18} />
                    <span>Rutini Oluştur</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}