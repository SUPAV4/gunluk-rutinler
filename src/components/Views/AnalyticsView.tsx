import React from 'react'
import { motion } from 'framer-motion'

export function AnalyticsView() {
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