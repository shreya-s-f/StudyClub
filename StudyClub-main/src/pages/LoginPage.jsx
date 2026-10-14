import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Sparkles,
  Users,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  User,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login, signup, hasRegisteredUsers, checkUsernameAvailability } = useAuth()
  const navigate = useNavigate()

  // Portal Mode: 'student' vs 'admin'
  const [portalMode, setPortalMode] = useState('student')

  // Sign Up vs Sign In Tab
  const [isSignUp, setIsSignUp] = useState(!hasRegisteredUsers())

  // Form Fields
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [major, setMajor] = useState('Computer Science & AI')
  const [department, setDepartment] = useState('Platform Operations')
  const [adminPasscode, setAdminPasscode] = useState('ADMIN2026')

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false)

  // Real-time username validation status
  const [usernameStatus, setUsernameStatus] = useState(null)

  // Live validate username as user types
  useEffect(() => {
    if (!isSignUp || !username.trim()) {
      setUsernameStatus(null)
      return
    }
    const timer = setTimeout(() => {
      const res = checkUsernameAvailability(username)
      setUsernameStatus(res)
    }, 250)
    return () => clearTimeout(timer)
  }, [username, isSignUp])

  const handleQuickDemoAdmin = () => {
    setEmail('superadmin')
    setPassword('admin123')
    setIsSignUp(false)
    toast('⚡ Demo Admin credentials filled!', { icon: '🔑' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const isAdmin = portalMode === 'admin'

    if (isSignUp) {
      if (!name.trim()) {
        toast.error('Please enter your full name')
        return
      }

      if (!username.trim()) {
        toast.error('Please choose a unique username')
        return
      }

      if (usernameStatus && !usernameStatus.available) {
        toast.error(usernameStatus.message)
        return
      }

      if (!email.trim()) {
        toast.error('Please enter your email address')
        return
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long')
        return
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match! Please re-type your password.')
        return
      }

      if (isAdmin && adminPasscode.trim().toUpperCase() !== 'ADMIN2026') {
        toast.error('Invalid Admin Passcode! Use "ADMIN2026" to authorize administrator registration.')
        return
      }

      try {
        const newUser = signup({
          name,
          username,
          email,
          password,
          major: isAdmin ? 'Platform Administration' : major,
          department: isAdmin ? department : undefined,
          role: isAdmin ? 'admin' : 'student',
          adminPasscode: isAdmin ? adminPasscode : undefined
        })

        if (isAdmin) {
          toast.success(`🎉 Administrator @${newUser.username} created successfully! Welcome to Admin Console.`)
          navigate('/admin')
        } else {
          toast.success(`🎉 Welcome to StudyClub, ${newUser.name}! Your account is ready.`)
          navigate('/dashboard')
        }
      } catch (err) {
        toast.error(err.message || 'Registration failed')
      }
    } else {
      // Sign In Flow
      if (!email.trim() || !password.trim()) {
        toast.error('Please enter your email or username and password')
        return
      }

      try {
        const loggedUser = login({
          identifier: email,
          password,
          asAdmin: isAdmin
        })

        if (loggedUser.role === 'admin') {
          toast.success(`Welcome back, Admin @${loggedUser.username || loggedUser.name}!`)
          navigate('/admin')
        } else {
          toast.success(`Signed in successfully as ${loggedUser.name}!`)
          navigate('/dashboard')
        }
      } catch (err) {
        toast.error(err.message || 'Authentication failed')
      }
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--bg-primary)'
      }}
      className="login-grid"
    >
      {/* ── LEFT COLUMN: BRAND & SHOWCASE ── */}
      <div
        style={{
          background: portalMode === 'admin'
            ? 'linear-gradient(135deg, #161513 0%, #291A14 50%, #1A1412 100%)'
            : 'linear-gradient(135deg, #1A1814 0%, #2D2A24 100%)',
          color: 'white',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: portalMode === 'admin' ? '#FF4D4D' : 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {portalMode === 'admin' ? <Shield size={24} color="white" /> : <BookOpen size={24} color="white" />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>StudyClub</h2>
            <span style={{ fontSize: '0.75rem', color: '#A09D96' }}>
              {portalMode === 'admin' ? 'Security & Administration Console' : 'Collaborative Student Platform'}
            </span>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 16 }}>
            {portalMode === 'admin' ? (
              <span className="badge" style={{ background: 'rgba(255, 77, 77, 0.2)', color: '#FF7B7B', border: '1px solid rgba(255, 77, 77, 0.4)' }}>
                🛡️ Privileged Administrator Portal
              </span>
            ) : (
              <span className="badge badge-accent">Collaborative Learning Platform</span>
            )}
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            {portalMode === 'admin'
              ? (isSignUp ? 'Register Unique Administrator Account' : 'Administrator Sign In & Oversight')
              : (isSignUp ? 'Sign Up to Start Learning Together' : 'Welcome Back to StudyClub')}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#C8C4BA', maxWidth: 490, marginBottom: '2.5rem' }}>
            {portalMode === 'admin'
              ? 'Administrator accounts require a unique system username, strong credentials, and authorization passcode to manage clubs, members, broadcasts, and security audit logs.'
              : 'Join virtual study rooms, generate instant AI flashcards and practice quizzes, track your Pomodoro focus, and organize your study tasks.'}
          </p>

          {/* Feature Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {portalMode === 'admin' ? (
              <>
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ShieldCheck size={22} color="#FF7B7B" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Full User Moderation</div>
                  <div style={{ fontSize: '0.8rem', color: '#A09D96' }}>Promote, suspend, or manage accounts</div>
                </div>
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <KeyRound size={22} color="var(--accent)" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Unique Username Security</div>
                  <div style={{ fontSize: '0.8rem', color: '#A09D96' }}>Audit trails with unique identity</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Sparkles size={22} color="var(--accent)" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Study Companion</div>
                  <div style={{ fontSize: '0.8rem', color: '#A09D96' }}>Instant explanations & quiz generation</div>
                </div>
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Users size={22} color="var(--accent-2)" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Study Rooms</div>
                  <div style={{ fontSize: '0.8rem', color: '#A09D96' }}>Collaborative rooms & group chat</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#7E7A73', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={16} /> Secure Authentication • Unique Username Verification • Audit Logging
        </div>
      </div>

      {/* ── RIGHT COLUMN: AUTHENTICATION FORM ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', overflowY: 'auto' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', padding: '2.25rem' }}>
          {/* 1. TOP PORTAL SELECTOR: STUDENT vs ADMIN */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Portal Type
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                background: 'var(--bg-secondary)',
                padding: 4,
                borderRadius: 12,
                border: '1px solid var(--border)'
              }}
            >
              <button
                type="button"
                onClick={() => setPortalMode('student')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: portalMode === 'student' ? 'var(--bg-card)' : 'transparent',
                  color: portalMode === 'student' ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: portalMode === 'student' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition)'
                }}
              >
                <GraduationCap size={16} /> Student Portal
              </button>

              <button
                type="button"
                onClick={() => setPortalMode('admin')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: portalMode === 'admin' ? '#FF4D4D' : 'transparent',
                  color: portalMode === 'admin' ? 'white' : 'var(--text-secondary)',
                  boxShadow: portalMode === 'admin' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition)'
                }}
              >
                <Shield size={16} /> Admin Portal
              </button>
            </div>
          </div>

          {/* 2. SIGN IN vs SIGN UP TABS */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-primary)',
              padding: 4,
              borderRadius: 10,
              marginBottom: '1.5rem',
              border: '1px solid var(--border)'
            }}
          >
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 7,
                fontSize: '0.85rem',
                fontWeight: 700,
                background: isSignUp ? 'var(--bg-card)' : 'transparent',
                color: isSignUp ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: isSignUp ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <UserPlus size={15} /> {portalMode === 'admin' ? 'Admin Sign Up' : 'Student Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 7,
                fontSize: '0.85rem',
                fontWeight: 700,
                background: !isSignUp ? 'var(--bg-card)' : 'transparent',
                color: !isSignUp ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: !isSignUp ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <LogIn size={15} /> Sign In
            </button>
          </div>

          {/* Admin Notice Box */}
          {portalMode === 'admin' && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255, 77, 77, 0.08)',
                border: '1px solid rgba(255, 77, 77, 0.25)',
                marginBottom: '1.25rem',
                fontSize: '0.8rem',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start'
              }}
            >
              <ShieldCheck size={18} color="#FF4D4D" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#FF4D4D' }}>Administrator Verification</strong>
                <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)' }}>
                  {isSignUp
                    ? 'Unique username & security passcode (ADMIN2026) required for privileged administrator registration.'
                    : 'Sign in with your administrator username or email.'}
                </p>
              </div>
            </div>
          )}

          {/* Headline */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {portalMode === 'admin'
                ? (isSignUp ? 'Create Administrator Account' : 'Administrator Sign In')
                : (isSignUp ? 'Create Student Account' : 'Sign In to StudyClub')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>
              {isSignUp
                ? 'Enter your unique identity details and credentials below.'
                : 'Enter your registered unique username or email and password.'}
            </p>
          </div>

          {/* Quick Demo Admin Button on Sign In */}
          {!isSignUp && portalMode === 'admin' && (
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="btn btn-secondary"
              style={{
                width: '100%',
                marginBottom: '1.25rem',
                padding: '8px 12px',
                fontSize: '0.8rem',
                borderColor: '#FF4D4D',
                color: '#FF4D4D',
                background: 'rgba(255, 77, 77, 0.05)'
              }}
            >
              <Zap size={14} /> One-Click: Fill Demo Admin Credentials
            </button>
          )}

          {/* 3. THE FORM */}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="label" htmlFor="name">
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    id="name"
                    className="input"
                    style={{ paddingLeft: 36 }}
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (!username) {
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'))
                      }
                    }}
                    placeholder={portalMode === 'admin' ? 'e.g. Chief Admin Jordan' : 'e.g. Alex Rivera'}
                  />
                </div>
              </div>
            )}

            {/* Unique Username (Always required on Sign Up) */}
            {isSignUp && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label" htmlFor="username">
                    Unique Username <span style={{ color: 'var(--accent)', fontWeight: 800 }}>*</span>
                  </label>
                  {usernameStatus && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: usernameStatus.available ? 'var(--accent-2)' : '#E63946',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      {usernameStatus.available ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {usernameStatus.available ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontWeight: 800,
                      color: 'var(--accent)'
                    }}
                  >
                    @
                  </span>
                  <input
                    id="username"
                    className="input"
                    style={{
                      paddingLeft: 32,
                      borderColor: usernameStatus
                        ? (usernameStatus.available ? 'var(--accent-2)' : '#E63946')
                        : undefined
                    }}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder={portalMode === 'admin' ? 'admin_unique_handle' : 'student_username'}
                  />
                </div>
                {usernameStatus && (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      marginTop: 3,
                      color: usernameStatus.available ? 'var(--accent-2)' : '#E63946'
                    }}
                  >
                    {usernameStatus.message}
                  </div>
                )}
              </div>
            )}

            {/* Email or Identifier */}
            <div>
              <label className="label" htmlFor="email">
                {isSignUp
                  ? (portalMode === 'admin' ? 'Official Admin Email' : 'Email Address')
                  : 'Username or Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  id="email"
                  className="input"
                  style={{ paddingLeft: 36 }}
                  type={isSignUp ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isSignUp
                      ? (portalMode === 'admin' ? 'admin@studyclub.edu' : 'you@example.com')
                      : 'superadmin or you@example.com'
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label" htmlFor="password">
                  Password
                </label>
                {isSignUp && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Minimum 6 characters
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  id="password"
                  className="input"
                  style={{ paddingLeft: 36, paddingRight: 38 }}
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    id="confirmPassword"
                    className="input"
                    style={{ paddingLeft: 36 }}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div style={{ fontSize: '0.72rem', color: '#E63946', marginTop: 3 }}>
                    Passwords do not match
                  </div>
                )}
              </div>
            )}

            {/* Role-Specific Fields (Sign Up only) */}
            {isSignUp && portalMode === 'admin' ? (
              <>
                <div>
                  <label className="label" htmlFor="department">
                    Admin Department / Designation
                  </label>
                  <select
                    id="department"
                    className="input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Platform Operations">Platform Operations & Oversight 🛡️</option>
                    <option value="Curriculum & Faculty Lead">Curriculum & Faculty Lead 🎓</option>
                    <option value="Study Club Moderation">Study Club Moderation 👥</option>
                    <option value="IT Systems & Security">IT Systems & Security 💻</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="label" htmlFor="adminPasscode">
                      Security Authorization Passcode
                    </label>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>
                      Passcode: ADMIN2026
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <KeyRound
                      size={16}
                      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      id="adminPasscode"
                      className="input"
                      style={{ paddingLeft: 36, fontFamily: 'monospace', letterSpacing: '1px' }}
                      required
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="ADMIN2026"
                    />
                  </div>
                </div>
              </>
            ) : isSignUp ? (
              <div>
                <label className="label" htmlFor="major">Study Major / Branch</label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap
                    size={16}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <select
                    id="major"
                    className="input"
                    style={{ paddingLeft: 36 }}
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  >
                    <option value="Computer Science & AI">Computer Science & AI 💻</option>
                    <option value="Quantum Physics & Math">Quantum Physics & Math 🔬</option>
                    <option value="Pre-Med & BioChem">Pre-Med & BioChem 🧬</option>
                    <option value="Electrical & Robotics Engineering">Electrical & Robotics Engineering ⚡</option>
                    <option value="Business & Economics">Business & Economics 📈</option>
                  </select>
                </div>
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '12px',
                fontSize: '0.95rem',
                marginTop: 6,
                background: portalMode === 'admin' ? '#FF4D4D' : 'var(--accent)'
              }}
            >
              {isSignUp
                ? (portalMode === 'admin' ? 'Register as Administrator 🛡️' : 'Sign Up & Create Account')
                : (portalMode === 'admin' ? 'Sign In to Admin Console 🛡️' : 'Sign In')}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Toggle bottom link */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  style={{ color: portalMode === 'admin' ? '#FF4D4D' : 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Sign In here
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  style={{ color: portalMode === 'admin' ? '#FF4D4D' : 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {portalMode === 'admin' ? 'Register New Admin' : 'Sign Up here'}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
