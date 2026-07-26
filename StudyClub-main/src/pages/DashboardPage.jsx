import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flame,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar,
  Volume2,
  CheckSquare,
  Award
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePomodoro } from '../contexts/PomodoroContext'
import { useClub } from '../contexts/ClubContext'
import { db } from '../services/db'
import toast from 'react-hot-toast'

const DAILY_QUOTES = [
  "\"Energy and persistence conquer all things.\" — Benjamin Franklin",
  "\"The secret of getting ahead is getting started.\" — Mark Twain",
  "\"Focus is a muscle. The more you practice, the stronger it gets.\" — Cal Newport",
  "\"Small daily improvements over time lead to stunning results.\" — Robin Sharma"
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { formattedTime, isRunning, toggleTimer, resetTimer, mode, switchMode, soundTrack, setSoundTrack } = usePomodoro()
  const { clubs, setActiveClub } = useClub()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [quoteIndex] = useState(Math.floor(Math.random() * DAILY_QUOTES.length))
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const taskList = await db.getTasks()
      const noteList = await db.getNotes()
      const fcList = await db.getFlashcards()
      setTasks(taskList)
      setNotes(noteList)
      setFlashcards(fcList)
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleTask = async (id, currentCompleted) => {
    await db.updateTask(id, { is_completed: !currentCompleted, status: !currentCompleted ? 'completed' : 'todo' })
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentCompleted, status: !currentCompleted ? 'completed' : 'todo' } : t))
    toast.success(!currentCompleted ? 'Task completed! Great job 🎉' : 'Task restored to list')
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const created = await db.createTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      due_date: new Date().toISOString().split('T')[0]
    })
    setTasks(prev => [created, ...prev])
    setNewTaskTitle('')
    setShowTaskModal(false)
    toast.success('Task created successfully!')
  }

  const pendingTasks = tasks.filter(t => !t.is_completed)

  return (
    <div style={{ display: 'grid', gap: '1.75rem' }}>
      {/* ── HERO BANNER ── */}
      <div className="card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-accent"><Flame size={14} /> {user?.streak || 7} DAY STREAK</span>
              <span className="badge badge-purple">LVL {user?.level || 5} SCHOLAR</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>
              Good day, {user?.name || 'Student'}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.95rem', maxWidth: 620 }}>
              {DAILY_QUOTES[quoteIndex]}
            </p>
          </div>

          {/* Level & XP Progress Card */}
          <div style={{ background: 'var(--bg-card)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minWidth: 240 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, marginBottom: 6 }}>
              <span>Progress to Lvl {(user?.level || 5) + 1}</span>
              <span style={{ color: 'var(--accent)' }}>{user?.xp || 3650} / 5000 XP</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${((user?.xp || 3650) / 5000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), #FF8555)', borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Award size={13} /> Complete 1 more Pomodoro to gain +50 XP
            </div>
          </div>
        </div>
      </div>

      {/* ── METRICS OVERVIEW CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Focus Hours</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.totalHours || 36.5}h</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-2)', marginTop: 4 }}>+2.5h tracked today</div>
        </div>

        <div className="card card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pomodoros</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-2-soft)', color: 'var(--accent-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.pomodoros || 88}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Completed focus cycles</div>
        </div>

        <div className="card card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tasks Due</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-3-soft)', color: 'var(--accent-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckSquare size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pendingTasks.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: 4 }}>{pendingTasks.filter(t => t.priority === 'high').length} high priority</div>
        </div>

        <div className="card card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Study Clubs</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={18} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{clubs.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Active memberships</div>
        </div>
      </div>

      {/* ── QUICK ACTIONS BAR ── */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        <button type="button" onClick={() => switchMode('work')} className="btn btn-primary">
          <Play size={16} /> Start 25m Focus
        </button>
        <button type="button" onClick={() => setShowTaskModal(true)} className="btn btn-secondary">
          <Plus size={16} /> Add Task
        </button>
        <button type="button" onClick={() => navigate('/ai')} className="btn btn-secondary">
          <Sparkles size={16} color="var(--accent-3)" /> Ask AI Assistant
        </button>
        <button type="button" onClick={() => navigate('/clubs')} className="btn btn-secondary">
          <Users size={16} /> Join Study Club
        </button>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem' }} className="dashboard-grid">
        {/* Left Column: Tasks & Planner Preview */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Today's Tasks */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Today's Tasks & Assignments</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Track and check off your study goals</p>
              </div>
              <button type="button" onClick={() => navigate('/planner')} className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
                View Planner <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => handleToggleTask(task.id, task.is_completed)}
                    style={{ width: 18, height: 18, accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: task.is_completed ? 'line-through' : 'none',
                      color: task.is_completed ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {task.title}
                    </div>
                    {task.club_name && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {task.club_name} • Due {task.due_date}
                      </div>
                    )}
                  </div>
                  <span className={`badge ${task.priority === 'high' ? 'badge-accent' : 'badge-green'}`}>
                    {task.priority || 'medium'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Focus Analytics Visualizer Chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>Weekly Study Hours</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Daily focus tracking (Mon — Sun)</p>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, padding: '0 10px' }}>
              {[
                { day: 'Mon', hours: 4.5 },
                { day: 'Tue', hours: 6.0 },
                { day: 'Wed', hours: 5.2 },
                { day: 'Thu', hours: 7.5 },
                { day: 'Fri', hours: 3.8 },
                { day: 'Sat', hours: 6.5 },
                { day: 'Sun', hours: 3.0 }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.hours}h</div>
                  <div style={{
                    width: 24,
                    height: `${(item.hours / 8) * 100}px`,
                    background: idx === 3 ? 'var(--accent)' : 'var(--accent-2)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease'
                  }} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Focus Controller & Recent Notes */}
        <div style={{ display: 'grid', gap: '1.5rem', alignContent: 'start' }}>
          {/* Live Focus Controller */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Focus Pomodoro</h3>
              <span className="badge badge-accent">{mode.toUpperCase()}</span>
            </div>

            <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '-1px' }}>
                {formattedTime}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                {isRunning ? '🔥 Stay focused in the zone...' : 'Click Start to begin session'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: '1.25rem' }}>
              <button type="button" onClick={toggleTimer} className="btn btn-primary" style={{ flex: 1 }}>
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button type="button" onClick={resetTimer} className="btn btn-secondary">
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Ambient Audio Player */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <Volume2 size={14} /> Ambient Background Audio
              </div>
              <select
                className="input"
                value={soundTrack}
                onChange={(e) => setSoundTrack(e.target.value)}
                style={{ fontSize: '0.8125rem' }}
              >
                <option value="none">Off (Silence)</option>
                <option value="rain">🌧️ Gentle Rain Waves</option>
                <option value="lofi">🎧 Chill Lo-Fi Beats</option>
                <option value="coffee">☕ Cafe Ambience</option>
              </select>
            </div>
          </div>

          {/* Shortcuts to Recent Notes */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Study Notes</h3>
              <button type="button" onClick={() => navigate('/planner')} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                View All
              </button>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} style={{ padding: 10, background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{note.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{note.tags?.join(' • ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CREATE TASK MODAL ── */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Add New Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Task Title / Description</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Read Quantum Physics Chapter 4"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Priority Level</label>
                <select
                  className="input"
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value)}
                >
                  <option value="high">High Priority 🔴</option>
                  <option value="medium">Medium Priority 🟡</option>
                  <option value="low">Low Priority 🟢</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
