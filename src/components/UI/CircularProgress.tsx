import React from 'react'
import { motion } from 'framer-motion'

interface CircularProgressProps {
  percentage: number
  completed: number
  total: number
  size?: number
}

export function CircularProgress({ percentage, completed, total, size = 120 }: CircularProgressProps) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="circular-progress">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage / 100)}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="progress-text">
        <span className="percentage">{Math.round(percentage)}%</span>
        <span className="label">{completed}/{total}</span>
      </div>
      
      <svg width="0" height="0">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}