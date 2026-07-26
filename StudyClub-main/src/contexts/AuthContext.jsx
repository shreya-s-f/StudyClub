import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem('studyclub_registered_users')
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    return []
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('studyclub-user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        localStorage.removeItem('studyclub-user')
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  const hasRegisteredUsers = () => {
    return getRegisteredUsers().length > 0
  }

  const signup = ({ name, email, password, major }) => {
    const users = getRegisteredUsers()
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      throw new Error('An account with this email already exists! Please sign in.')
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      email: email.trim(),
      name: name.trim(),
      major: major || 'Computer Science & Engineering',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      streak: 1,
      totalHours: 0,
      pomodoros: 0,
      level: 1,
      xp: 150,
      bio: `Student majoring in ${major || 'Computer Science'}.`
    }

    users.push({ ...newUser, password: password.trim() })
    localStorage.setItem('studyclub_registered_users', JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem('studyclub-user', JSON.stringify(newUser))
    return newUser
  }

  const login = ({ email, password }) => {
    const users = getRegisteredUsers()
    const found = users.find(
      u => (u.email.toLowerCase() === email.trim().toLowerCase() || u.name.toLowerCase() === email.trim().toLowerCase()) &&
           u.password === password.trim()
    )

    if (!found) {
      throw new Error('Invalid email/name or password! Please check your credentials or Sign Up.')
    }

    const { password: _, ...userNoPass } = found
    setUser(userNoPass)
    localStorage.setItem('studyclub-user', JSON.stringify(userNoPass))
    return userNoPass
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('studyclub-user')
  }

  const updateUserProfile = (updates) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      localStorage.setItem('studyclub-user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile, hasRegisteredUsers }}>
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
