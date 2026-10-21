import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  USERS: 'studyclub_registered_users',
  CURRENT_USER: 'studyclub-user',
  AUDIT_LOGS: 'studyclub_audit_logs',
  ANNOUNCEMENTS: 'studyclub_announcements'
}

// Initial Pre-configured Seed Accounts
const DEFAULT_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Chief Admin',
    username: 'superadmin',
    email: 'admin@studyclub.edu',
    password: 'admin123',
    role: 'admin',
    major: 'Platform Administration',
    department: 'Systems & Curriculum Operations',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SuperAdminMaster',
    streak: 30,
    totalHours: 120,
    pomodoros: 240,
    level: 10,
    xp: 5000,
    status: 'active',
    bio: 'Platform Administrator with complete oversight of clubs, users, and moderation.',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'usr-student-1',
    name: 'Alex Rivera',
    username: 'alex_r',
    email: 'alex@example.com',
    password: 'password123',
    role: 'student',
    major: 'Computer Science & AI',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    streak: 14,
    totalHours: 48.5,
    pomodoros: 116,
    level: 5,
    xp: 1850,
    status: 'active',
    bio: 'Student passionate about Quantum Physics and AI systems.',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'usr-student-2',
    name: 'Sophia Chen',
    username: 'sophia_ai',
    email: 'sophia@example.com',
    password: 'password123',
    role: 'student',
    major: 'AI & Machine Learning Lab',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    streak: 11,
    totalHours: 42.0,
    pomodoros: 101,
    level: 4,
    xp: 1420,
    status: 'active',
    bio: 'Building neural networks, transformers, and computer vision models.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
]

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Welcome to StudyClub PRO Platform',
    message: 'Collaborative rooms, AI tutor sessions, and study clubs are now running 24/7. Invite your classmates!',
    type: 'info',
    active: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
]

const DEFAULT_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    action: 'System Initialized',
    details: 'Security audit logging and admin oversight active.',
    actor: 'system'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: 'Admin Pre-configured',
    details: 'Super Admin (@superadmin) initialized with full permissions.',
    actor: 'system'
  }
]

// Safe LocalStorage wrapper preventing unhandled browser storage errors
const safeStorage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null
    } catch (e) {
      return null
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val)
      }
    } catch (e) {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    } catch (e) {}
  }
}

function getRegisteredUsers() {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.USERS)
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS))
      return DEFAULT_USERS
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS))
      return DEFAULT_USERS
    }
    return parsed
  } catch (err) {
    return DEFAULT_USERS
  }
}

function saveRegisteredUsers(users) {
  try {
    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to save users:', err)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)
      return raw ? JSON.parse(raw) : DEFAULT_ANNOUNCEMENTS
    } catch {
      return DEFAULT_ANNOUNCEMENTS
    }
  })
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)
      return raw ? JSON.parse(raw) : DEFAULT_AUDIT_LOGS
    } catch {
      return DEFAULT_AUDIT_LOGS
    }
  })

  useEffect(() => {
    try {
      // Ensure default users are initialized
      getRegisteredUsers()

      const stored = safeStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Verify user still exists in registered database
          const users = getRegisteredUsers()
          const currentInDb = users.find(u => u.id === parsed.id)
          if (currentInDb) {
            const { password: _, ...cleanUser } = currentInDb
            setUser(cleanUser)
          } else {
            setUser(parsed)
          }
        } catch (error) {
          safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (e) {
      console.warn('Auth initialization warning:', e)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const hasRegisteredUsers = () => {
    return getRegisteredUsers().length > 0
  }

  const logAudit = (action, details, actorName) => {
    const newLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      action,
      details,
      actor: actorName || user?.username || user?.name || 'system'
    }
    setAuditLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100) // keep latest 100
      try {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  // Check unique username availability
  const checkUsernameAvailability = (usernameCandidate) => {
    if (!usernameCandidate || !usernameCandidate.trim()) {
      return { available: false, message: 'Username cannot be blank' }
    }
    const clean = usernameCandidate.trim().toLowerCase().replace(/^@/, '')
    if (clean.length < 3) {
      return { available: false, message: 'Username must be at least 3 characters' }
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      return { available: false, message: 'Username can only contain letters, numbers, hyphens, and underscores' }
    }
    const users = getRegisteredUsers()
    const taken = users.some(u => (u.username && u.username.toLowerCase() === clean))
    if (taken) {
      return { available: false, message: `Username "@${clean}" is already taken` }
    }
    return { available: true, message: `Username "@${clean}" is available!` }
  }

  const signup = ({
    name,
    username,
    email,
    password,
    major,
    role = 'student',
    adminPasscode,
    department
  }) => {
    const users = getRegisteredUsers()

    // 1. Email uniqueness check
    const existingEmail = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (existingEmail) {
      throw new Error(`An account with email "${email.trim()}" already exists! Please sign in.`)
    }

    // 2. Username validation & uniqueness check
    const rawUsername = (username || name.replace(/\s+/g, '_')).trim().toLowerCase().replace(/^@/, '')
    if (rawUsername.length < 3) {
      throw new Error('Username must be at least 3 characters long.')
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(rawUsername)) {
      throw new Error('Username can only contain alphanumeric characters, underscores, and dashes.')
    }
    const existingUsername = users.find(u => u.username && u.username.toLowerCase() === rawUsername)
    if (existingUsername) {
      throw new Error(`The username "@${rawUsername}" is already taken! Please choose a unique username.`)
    }

    // 3. Password strength check
    if (!password || password.trim().length < 6) {
      throw new Error('Password must be at least 6 characters long for security.')
    }

    // 4. Admin Security Passcode Verification
    const isAdmin = role === 'admin'
    if (isAdmin) {
      const passcode = (adminPasscode || '').trim().toUpperCase()
      if (passcode !== 'ADMIN2026') {
        throw new Error('Invalid Admin Security Passcode! Enter "ADMIN2026" to authorize administrator registration.')
      }
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      email: email.trim(),
      username: rawUsername,
      name: name.trim(),
      role: isAdmin ? 'admin' : 'student',
      major: major || (isAdmin ? 'Platform Administration' : 'Computer Science & AI'),
      department: department || (isAdmin ? 'Systems & Administration' : 'Academic'),
      avatar: isAdmin
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rawUsername)}`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      streak: 1,
      totalHours: 0,
      pomodoros: 0,
      level: isAdmin ? 99 : 1,
      xp: isAdmin ? 5000 : 150,
      status: 'active',
      bio: isAdmin
        ? `Platform Administrator (@${rawUsername}) with moderation privileges.`
        : `Student majoring in ${major || 'Computer Science'}.`,
      created_at: new Date().toISOString()
    }

    users.push({ ...newUser, password: password.trim() })
    saveRegisteredUsers(users)

    logAudit(
      isAdmin ? 'Admin Registered' : 'Student Registered',
      `${name.trim()} registered with username @${rawUsername} (${isAdmin ? 'Admin' : 'Student'}).`,
      rawUsername
    )

    setUser(newUser)
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))
    return newUser
  }

  const login = ({ identifier, email, password, asAdmin = false }) => {
    const users = getRegisteredUsers()
    const query = (identifier || email || '').trim().toLowerCase().replace(/^@/, '')

    if (!query || !password || !password.trim()) {
      throw new Error('Please enter both your identifier (email/username) and password.')
    }

    const found = users.find(
      u => (
        (u.email && u.email.toLowerCase() === query) ||
        (u.username && u.username.toLowerCase() === query) ||
        (u.name && u.name.toLowerCase() === query)
      ) && u.password === password.trim()
    )

    if (!found) {
      throw new Error('Invalid username/email or password! Please check your credentials or Sign Up.')
    }

    if (found.status === 'suspended') {
      throw new Error('This account has been suspended by a platform administrator. Please contact support.')
    }

    if (asAdmin && found.role !== 'admin') {
      throw new Error('This account does not have administrator privileges. Please sign in via the Student Portal.')
    }

    const { password: _, ...userNoPass } = found
    setUser(userNoPass)
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userNoPass))

    logAudit('User Sign In', `${found.name} (@${found.username || 'user'}) signed in successfully.`, found.username)
    return userNoPass
  }

  const logout = () => {
    if (user) {
      logAudit('User Sign Out', `${user.name} (@${user.username || 'user'}) signed out.`, user.username)
    }
    setUser(null)
    safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  const updateUserProfile = (updates) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated))

      // Also update in registered list
      const users = getRegisteredUsers()
      const index = users.findIndex(u => u.id === prev.id)
      if (index !== -1) {
        users[index] = { ...users[index], ...updates }
        saveRegisteredUsers(users)
      }

      return updated
    })
  }

  // ── ADMIN OPERATIONS ──

  const getAllUsers = () => {
    const raw = getRegisteredUsers()
    return raw.map(({ password: _, ...u }) => u)
  }

  const deleteUser = (userId) => {
    if (user?.id === userId) {
      throw new Error('Security policy: You cannot delete your own logged-in administrator account.')
    }
    const users = getRegisteredUsers()
    const target = users.find(u => u.id === userId)
    if (!target) throw new Error('User not found.')

    const updated = users.filter(u => u.id !== userId)
    saveRegisteredUsers(updated)

    logAudit('Admin Deleted User', `Admin deleted account for ${target.name} (@${target.username}).`, user?.username)
    return target
  }

  const updateUserRole = (userId, newRole) => {
    if (user?.id === userId && newRole !== 'admin') {
      throw new Error('You cannot remove admin privileges from your own currently active session.')
    }
    const users = getRegisteredUsers()
    const target = users.find(u => u.id === userId)
    if (!target) throw new Error('User not found.')

    target.role = newRole
    if (newRole === 'admin') {
      target.level = Math.max(target.level || 1, 99)
      target.xp = Math.max(target.xp || 0, 5000)
    }
    saveRegisteredUsers(users)

    logAudit('Role Changed', `Admin changed role for ${target.name} to "${newRole}".`, user?.username)
    return target
  }

  const updateUserStatus = (userId, newStatus) => {
    if (user?.id === userId && newStatus === 'suspended') {
      throw new Error('You cannot suspend your own logged-in administrator account.')
    }
    const users = getRegisteredUsers()
    const target = users.find(u => u.id === userId)
    if (!target) throw new Error('User not found.')

    target.status = newStatus
    saveRegisteredUsers(users)

    logAudit('Account Status Updated', `Admin updated status for ${target.name} to "${newStatus}".`, user?.username)
    return target
  }

  // ── ANNOUNCEMENTS MANAGEMENT ──

  const addAnnouncement = ({ title, message, type = 'info' }) => {
    const newAnn = {
      id: 'ann-' + Date.now(),
      title: title.trim(),
      message: message.trim(),
      type,
      active: true,
      createdAt: new Date().toISOString()
    }
    const updated = [newAnn, ...announcements]
    setAnnouncements(updated)
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    logAudit('Broadcast Published', `Admin published broadcast: "${title}".`, user?.username)
    return newAnn
  }

  const toggleAnnouncement = (id) => {
    const updated = announcements.map(a => a.id === id ? { ...a, active: !a.active } : a)
    setAnnouncements(updated)
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id)
    setAnnouncements(updated)
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    logAudit('Broadcast Deleted', `Admin deleted broadcast ID ${id}.`, user?.username)
  }

  const clearAuditLogs = () => {
    setAuditLogs([])
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateUserProfile,
      hasRegisteredUsers,
      checkUsernameAvailability,
      // Admin methods
      getAllUsers,
      deleteUser,
      updateUserRole,
      updateUserStatus,
      auditLogs,
      logAudit,
      clearAuditLogs,
      announcements,
      addAnnouncement,
      toggleAnnouncement,
      deleteAnnouncement
    }}>
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
