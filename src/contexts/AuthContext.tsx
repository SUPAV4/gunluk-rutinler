import React, { useState, useEffect, createContext, useContext } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date
  lastLogin: Date
  totalHabits: number
  longestStreak: number
  level: number
  experience: number
  achievements: string[]
  isPremium: boolean
}

interface AuthContextType {
  user: { uid: string; email: string; displayName: string } | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// LocalStorage keys
const USER_KEY = 'gunluk-rutinler-user'
const PROFILE_KEY = 'gunluk-rutinler-profile'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid
        setUser({
          uid,
          email: user.email || '',
          displayName: user.displayName || ''
        })
        
        // Firestore'dan kullanıcı profilini yükle
        const userProfileDoc = await getDoc(doc(db, 'users', uid))
        if (userProfileDoc.exists()) {
          const profileData = userProfileDoc.data() as UserProfile
          setUserProfile({
            ...profileData,
            uid,
            email: user.email || '',
            displayName: user.displayName || ''
          })
        } else {
          setUserProfile(null)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const uid = user.uid
      setUser({
        uid,
        email,
        displayName: user.displayName || ''
      })
      
      // Firestore'dan kullanıcı profilini yükle
      const userProfileDoc = await getDoc(doc(db, 'users', uid))
      if (userProfileDoc.exists()) {
        const profileData = userProfileDoc.data() as UserProfile
        setUserProfile({
          ...profileData,
          uid,
          email,
          displayName: user.displayName || ''
        })
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      const uid = user.uid
      
      // Kullanıcı profilini oluştur
      const userProfile: UserProfile = {
        uid,
        email,
        displayName,
        createdAt: new Date(),
        lastLogin: new Date(),
        totalHabits: 0,
        longestStreak: 0,
        level: 1,
        experience: 0,
        achievements: [],
        isPremium: false
      }
      
      // Firestore'a kullanıcı profilini kaydet
      await setDoc(doc(db, 'users', uid), userProfile)
      
      setUser({
        uid,
        email,
        displayName
      })
      setUserProfile(userProfile)
      
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      let profile: UserProfile | null = null
      const uid = user.uid
      
      // Firestore'dan kullanıcı profilini kontrol et
      const userProfileDoc = await getDoc(doc(db, 'users', uid))
      if (userProfileDoc.exists()) {
        profile = userProfileDoc.data() as UserProfile
        // Profil varsa, son giriş tarihini güncelle
        await updateDoc(doc(db, 'users', uid), {
          lastLogin: serverTimestamp()
        })
      } else {
        // Profil yoksa, yeni bir profil oluştur
        profile = {
          uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          lastLogin: new Date(),
          totalHabits: 0,
          longestStreak: 0,
          level: 1,
          experience: 0,
          achievements: [],
          isPremium: false
        }
        // Firestore'a yeni profili kaydet
        await setDoc(doc(db, 'users', uid), profile)
      }
      
      setUser({
        uid,
        email: user.email || '',
        displayName: user.displayName || ''
      })
      setUserProfile(profile)
      
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setUser(null)
      setUserProfile(null)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return
    
    setLoading(true)
    try {
      const updatedProfile = { ...userProfile, ...data }
      setUserProfile(updatedProfile)
      
      // Firestore'da kullanıcı profilini güncelle
      await updateDoc(doc(db, 'users', user.uid), updatedProfile)
      
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}