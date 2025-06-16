import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

export function ProfileView() {
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