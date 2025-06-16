import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  icon: string
  value: number | string
  label: string
  index?: number
}

export function StatCard({ icon, value, label, index = 0 }: StatCardProps) {
  return (
    <motion.div 
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}