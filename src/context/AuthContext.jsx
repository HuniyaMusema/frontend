import { createContext, useContext, useState, useEffect } from 'react'
import { mockAPI } from '../services/mockAPI'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          const userData = await mockAPI.getUser(userId)
          if (userData) {
            setUser(userData)
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          localStorage.removeItem('userId')
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const result = await mockAPI.login(email, password)
    if (result.success) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('userId', result.user.id)
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const signup = async (name, email, password, phone, role) => {
    const result = await mockAPI.signup(name, email, password, phone, role)
    if (result.success) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('userId', result.user.id)
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const updateProfile = async (userId, userData) => {
    const result = await mockAPI.updateUser(userId, userData)
    if (result) {
      setUser(result)
      return { success: true }
    }
    return { success: false, error: 'Failed to update profile' }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

