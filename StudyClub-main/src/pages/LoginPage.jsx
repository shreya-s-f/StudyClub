import { useState } from 'react'
import { BookOpen, Sparkles, Users, ArrowRight, ShieldCheck, UserPlus, LogIn, Lock, Mail, User, GraduationCap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login, signup, hasRegisteredUsers } = useAuth()
  
  // Default to Sign Up if no users registered yet
  const [isSignUp, setIsSignUp] = useState(!hasRegisteredUsers())

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [major, setMajor] = useState('Computer Science & AI')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password')
      return
    }

    try {
      if (isSignUp) {
        if (!name.trim()) {
          toast.error('Please enter your full name')
          return
        }
        signup({ name, email, password, major })
        toast.success(`🎉 Welcome to StudyClub, ${name}! Your account has been created.`)
      } else {
        login({ email, password })
        toast.success('Signed in successfully!')
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-primary)' }} className="login-grid">
      {/* Left Column — Feature Showcase */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1814 0%, #2D2A24 100%)',
        color: 'white',
        padding: '4rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>StudyClub</h2>
        </div>

        <div>
          <span className="badge badge-accent" style={{ marginBottom: 16 }}>Collaborative Learning Platform</span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            {isSignUp ? 'Sign Up to Start Learning Together' : 'Welcome back to StudyClub'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#C8C4BA', maxWidth: 480, marginBottom: '2.5rem' }}>
            Join virtual study rooms, generate instant AI flashcards and practice quizzes, track your Pomodoro focus, and organize your tasks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#7E7A73', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={16} /> Secure Authentication & Persistent Account Storage
        </div>
      </div>

      {/* Right Column — Sign Up / Sign In Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div className="card" style={{ maxWidth: 460, width: '100%', padding: '2.5rem' }}>
          {/* Sign Up vs Sign In Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: 4, borderRadius: 12, marginBottom: '1.75rem', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                fontSize: '0.875rem',
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
              <UserPlus size={16} /> Sign Up
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                fontSize: '0.875rem',
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
              <LogIn size={16} /> Sign In
            </button>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
            {isSignUp ? 'Create your Account' : 'Sign In to your Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {isSignUp ? 'Enter your details below to create a new student profile.' : 'Enter your registered email/name and password.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.1rem' }}>
            {isSignUp && (
              <div>
                <label className="label" htmlFor="name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="name"
                    className="input"
                    style={{ paddingLeft: 36 }}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">{isSignUp ? 'Email Address' : 'Email Address or Name'}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  className="input"
                  style={{ paddingLeft: 36 }}
                  type={isSignUp ? "email" : "text"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSignUp ? "you@example.com" : "you@example.com or Full Name"}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  className="input"
                  style={{ paddingLeft: 36 }}
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="label" htmlFor="major">Study Major / Branch</label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.95rem', marginTop: 6 }}>
              {isSignUp ? 'Sign Up & Create Account' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isSignUp ? (
              <span>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} style={{ color: 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Sign In here</button></span>
            ) : (
              <span>Don't have an account yet? <button type="button" onClick={() => setIsSignUp(true)} style={{ color: 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Up here</button></span>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
