import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Sparkles,
  CalendarCheck,
  Sun,
  Moon,
  LogOut,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Search,
  Bell,
  BookOpen,
  Trophy,
  Activity
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { usePomodoro } from '../../contexts/PomodoroContext'
import { useClub } from '../../contexts/ClubContext'
import BadgesModal from '../BadgesModal'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { formattedTime, isRunning, toggleTimer, resetTimer, mode } = usePomodoro()
  const { activeClub } = useClub()
  const navigate = useNavigate()

  const [showBadgesModal, setShowBadgesModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        zIndex: 90
      }}>
        {/* App Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent), #FF8555)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-md)'
            }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>StudyClub</h2>
              <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>PRO</span>
            </div>
          </div>
        </div>

        {/* Current Signed-In User Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt="User Avatar"
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Student'}
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.major || user?.email || 'Student Account'}
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'white' : 'var(--text-primary)',
              background: isActive ? 'var(--accent)' : 'transparent'
            })}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/clubs"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'white' : 'var(--text-primary)',
              background: isActive ? 'var(--accent)' : 'transparent'
            })}
          >
            <Users size={18} />
            Study Clubs
          </NavLink>

          <NavLink
            to="/ai"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'white' : 'var(--text-primary)',
              background: isActive ? 'var(--accent)' : 'transparent'
            })}
          >
            <Sparkles size={18} />
            AI Assistant
          </NavLink>

          <NavLink
            to="/planner"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'white' : 'var(--text-primary)',
              background: isActive ? 'var(--accent)' : 'transparent'
            })}
          >
            <CalendarCheck size={18} />
            Planner & Tasks
          </NavLink>

          <button
            type="button"
            onClick={() => setShowBadgesModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <Trophy size={18} color="var(--accent)" />
            Achievements & Badges
          </button>
        </nav>

        {/* Active Study Club Shortcut */}
        {activeClub && (
          <div style={{ marginTop: 'auto', padding: '12px', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>Active Club</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{activeClub.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Code: {activeClub.join_code}</div>
          </div>
        )}

        {/* Theme Toggle Button */}
        <div style={{ display: 'grid', gap: 6, marginTop: 'auto' }}>
          <button type="button" onClick={toggleTheme} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA & HEADER ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{
          height: 'var(--header-height)',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 80
        }}>
          {/* Left: Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 400 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                style={{ paddingLeft: 36, height: 38 }}
                placeholder="Search notes, study clubs, AI help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Header Widgets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Live Audio Visualizer */}
            {isRunning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 10px', background: 'var(--accent-soft)', borderRadius: 99 }} title="Focus Audio Visualizer Active">
                <Activity size={16} color="var(--accent)" />
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 16 }}>
                  <div style={{ width: 3, height: 12, background: 'var(--accent)', animation: 'pulse 0.5s infinite alternate' }} />
                  <div style={{ width: 3, height: 16, background: 'var(--accent)', animation: 'pulse 0.7s infinite alternate' }} />
                  <div style={{ width: 3, height: 8, background: 'var(--accent)', animation: 'pulse 0.4s infinite alternate' }} />
                </div>
              </div>
            )}

            {/* Persistent Mini Pomodoro Widget */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: 99,
              border: '1px solid var(--border)'
            }}>
              <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                {mode === 'work' ? 'FOCUS' : 'BREAK'}
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', width: 48, textAlign: 'center' }}>
                {formattedTime}
              </span>
              <button
                type="button"
                onClick={toggleTimer}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isRunning ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}
              </button>
              <button type="button" onClick={resetTimer} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Streak Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: 'var(--accent-soft)',
              borderRadius: 99,
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              <Flame size={16} />
              {user?.streak || 1} Days
            </div>

            {/* Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowNotifications(prev => !prev)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)'
                }}
              >
                <Bell size={18} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }} />
              </button>

              {showNotifications && (
                <div className="card" style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 300,
                  padding: '1rem',
                  zIndex: 200,
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <h4 style={{ marginBottom: 8, fontSize: '0.9rem' }}>Notifications</h4>
                  <div style={{ display: 'grid', gap: 8, fontSize: '0.8125rem' }}>
                    <div style={{ padding: 8, background: 'var(--bg-primary)', borderRadius: 8 }}>
                      🎉 Welcome to StudyClub! Create or join your first study group.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── TOP RIGHT CORNER LOGOUT / SIGN OUT BUTTON ── */}
            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent)',
                borderColor: 'var(--accent-soft)',
                background: 'var(--accent-soft)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
              title="Sign Out of StudyClub"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* ── MODALS ── */}
      <BadgesModal isOpen={showBadgesModal} onClose={() => setShowBadgesModal(false)} />
    </div>
  )
}
