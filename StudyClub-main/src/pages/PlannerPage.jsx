import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  Clock,
  Calendar,
  BookOpen,
  Plus,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Tag,
  Search
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { usePomodoro } from '../contexts/PomodoroContext'
import { db } from '../services/db'
import toast from 'react-hot-toast'

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState('kanban') // 'kanban' | 'pomodoro' | 'calendar' | 'notes'

  // Global Pomodoro
  const { formattedTime, isRunning, toggleTimer, resetTimer, mode, switchMode, soundTrack, setSoundTrack } = usePomodoro()

  // State
  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])
  const [notes, setNotes] = useState([])

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)

  // New item forms
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')

  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0])
  const [newEventType, setNewEventType] = useState('study')

  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [noteSearch, setNoteSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const taskList = await db.getTasks()
      const eventList = await db.getCalendarEvents()
      const noteList = await db.getNotes()
      setTasks(taskList)
      setEvents(eventList)
      setNotes(noteList)
      if (noteList.length > 0) setSelectedNote(noteList[0])
    } catch (err) {
      console.error(err)
    }
  }

  // Task Actions
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
    toast.success('Task added to Kanban board!')
  }

  const handleUpdateTaskStatus = async (id, newStatus) => {
    const isComp = newStatus === 'completed'
    await db.updateTask(id, { status: newStatus, is_completed: isComp })
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, is_completed: isComp } : t))
  }

  const handleDeleteTask = async (id) => {
    await db.deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Task removed')
  }

  // Calendar Event Actions
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    if (!newEventTitle.trim()) return
    const created = await db.createCalendarEvent({
      title: newEventTitle,
      event_date: newEventDate,
      type: newEventType
    })
    setEvents(prev => [...prev, created])
    setNewEventTitle('')
    setShowEventModal(false)
    toast.success('Event added to calendar!')
  }

  const handleDeleteEvent = async (id) => {
    await db.deleteCalendarEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
    toast.success('Event deleted')
  }

  // Note Actions
  const handleCreateNote = async (e) => {
    e.preventDefault()
    if (!newNoteTitle.trim()) return
    const created = await db.createNote({
      title: newNoteTitle,
      content: newNoteContent
    })
    setNotes(prev => [created, ...prev])
    setSelectedNote(created)
    setNewNoteTitle('')
    setNewNoteContent('')
    setShowNoteModal(false)
    toast.success('Study note saved!')
  }

  const handleDeleteNote = async (id) => {
    await db.deleteNote(id)
    setNotes(prev => prev.filter(n => n.id !== id))
    if (selectedNote?.id === id) setSelectedNote(null)
    toast.success('Note deleted')
  }

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.content?.toLowerCase().includes(noteSearch.toLowerCase())
  )

  return (
    <div style={{ display: 'grid', gap: '1.75rem' }}>
      {/* ── HEADER ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Planner & Focus Suite</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage your tasks, run Pomodoro focus cycles, schedule events, and organize study notes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setShowTaskModal(true)} className="btn btn-primary">
              <Plus size={16} /> New Task
            </button>
            <button type="button" onClick={() => setShowEventModal(true)} className="btn btn-secondary">
              <Calendar size={16} /> Add Event
            </button>
            <button type="button" onClick={() => setShowNoteModal(true)} className="btn btn-secondary">
              <BookOpen size={16} /> Create Note
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="tabs-header" style={{ marginBottom: 0 }}>
          <button type="button" onClick={() => setActiveTab('kanban')} className={`tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}>
            <CalendarCheck size={16} style={{ display: 'inline', marginRight: 6 }} /> Task Kanban
          </button>
          <button type="button" onClick={() => setActiveTab('pomodoro')} className={`tab-btn ${activeTab === 'pomodoro' ? 'active' : ''}`}>
            <Clock size={16} style={{ display: 'inline', marginRight: 6 }} /> Pomodoro Suite
          </button>
          <button type="button" onClick={() => setActiveTab('calendar')} className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}>
            <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} /> Study Calendar
          </button>
          <button type="button" onClick={() => setActiveTab('notes')} className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}>
            <BookOpen size={16} style={{ display: 'inline', marginRight: 6 }} /> Notes Hub ({notes.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: KANBAN BOARD ── */}
      {activeTab === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            { key: 'todo', title: 'To Do 📌', bg: 'var(--bg-primary)' },
            { key: 'in-progress', title: 'In Progress ⏳', bg: 'var(--accent-soft)' },
            { key: 'completed', title: 'Completed ✅', bg: 'var(--accent-2-soft)' }
          ].map((col) => {
            const colTasks = tasks.filter(t => (t.status || 'todo') === col.key)
            return (
              <div key={col.key} className="card" style={{ padding: '1.25rem', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{col.title}</h3>
                  <span className="badge badge-accent">{colTasks.length}</span>
                </div>

                <div style={{ display: 'grid', gap: 10, minHeight: 250, alignContent: 'start' }}>
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: '12px',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.title}</div>
                        <button type="button" onClick={() => handleDeleteTask(t.id)} style={{ color: 'var(--text-muted)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span className={`badge ${t.priority === 'high' ? 'badge-accent' : 'badge-green'}`}>
                          {t.priority || 'medium'}
                        </span>

                        {col.key !== 'completed' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateTaskStatus(t.id, col.key === 'todo' ? 'in-progress' : 'completed')}
                            className="btn btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                          >
                            Move →
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-2)', fontWeight: 600 }}>Done</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── TAB 2: POMODORO SUITE ── */}
      {activeTab === 'pomodoro' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <button type="button" onClick={() => switchMode('work')} className={`btn ${mode === 'work' ? 'btn-primary' : 'btn-secondary'}`}>
                Focus (25m)
              </button>
              <button type="button" onClick={() => switchMode('shortBreak')} className={`btn ${mode === 'shortBreak' ? 'btn-primary' : 'btn-secondary'}`}>
                Short Break (5m)
              </button>
              <button type="button" onClick={() => switchMode('longBreak')} className={`btn ${mode === 'longBreak' ? 'btn-primary' : 'btn-secondary'}`}>
                Long Break (15m)
              </button>
            </div>

            <div style={{ fontSize: '4.5rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '-2px', margin: '1.5rem 0' }}>
              {formattedTime}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: '1.75rem' }}>
              <button type="button" onClick={toggleTimer} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? 'Pause Timer' : 'Start Focus'}
              </button>
              <button type="button" onClick={resetTimer} className="btn btn-secondary" style={{ padding: '12px' }}>
                <RotateCcw size={18} /> Reset
              </button>
            </div>

            <div style={{ textAlign: 'left', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                <Volume2 size={16} /> Ambient Sound Generator
              </div>
              <select className="input" value={soundTrack} onChange={e => setSoundTrack(e.target.value)}>
                <option value="none">Off (Silence)</option>
                <option value="rain">🌧️ Gentle Rain Waves</option>
                <option value="lofi">🎧 Chill Lo-Fi Study Beats</option>
                <option value="coffee">☕ Cafe Ambience</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Focus Tips & Session Stats</h3>
            <div style={{ display: 'grid', gap: 12, fontSize: '0.875rem' }}>
              <div style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 10 }}>
                💡 <strong>Feynman Technique</strong>: After each 25-minute Pomodoro, write down a 2-sentence summary of what you learned without looking at your notes.
              </div>
              <div style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 10 }}>
                ☕ <strong>Micro Breaks</strong>: Stand up, stretch, and drink water during your 5-minute break to reset focus.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: STUDY CALENDAR ── */}
      {activeTab === 'calendar' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Upcoming Events & Deadlines</h3>
            <button type="button" onClick={() => setShowEventModal(true)} className="btn btn-primary">
              <Plus size={16} /> Add Calendar Event
            </button>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ev.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    📅 Date: {ev.event_date} • {ev.start_time ? `${ev.start_time} - ${ev.end_time}` : 'All Day'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="badge badge-accent">{ev.type.toUpperCase()}</span>
                  <button type="button" onClick={() => handleDeleteEvent(ev.id)} style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: NOTES HUB ── */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem', height: 500, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                style={{ paddingLeft: 30, height: 34, fontSize: '0.8rem' }}
                placeholder="Search notes..."
                value={noteSearch}
                onChange={e => setNoteSearch(e.target.value)}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: 8, alignContent: 'start' }}>
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: selectedNote?.id === note.id ? 'var(--accent-soft)' : 'var(--bg-primary)',
                    border: '1px solid ' + (selectedNote?.id === note.id ? 'var(--accent)' : 'var(--border)'),
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{note.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{note.tags?.join(' • ')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem', height: 500, overflowY: 'auto' }}>
            {selectedNote ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedNote.title}</h2>
                  <button type="button" onClick={() => handleDeleteNote(selectedNote.id)} style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 100 }}>Select a note to view</div>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE TASK MODAL ── */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Add Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'grid', gap: '1rem' }}>
              <input className="input" required placeholder="Task title..." value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
              <select className="input" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}>
                <option value="high">High Priority 🔴</option>
                <option value="medium">Medium Priority 🟡</option>
                <option value="low">Low Priority 🟢</option>
              </select>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE EVENT MODAL ── */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Add Calendar Event</h3>
            <form onSubmit={handleCreateEvent} style={{ display: 'grid', gap: '1rem' }}>
              <input className="input" required placeholder="Event title..." value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} />
              <input className="input" type="date" required value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
              <select className="input" value={newEventType} onChange={e => setNewEventType(e.target.value)}>
                <option value="study">Study Session 📚</option>
                <option value="exam">Exam 📝</option>
                <option value="class">Class Lecture 🎓</option>
              </select>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEventModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE NOTE MODAL ── */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Create Study Note</h3>
            <form onSubmit={handleCreateNote} style={{ display: 'grid', gap: '1rem' }}>
              <input className="input" required placeholder="Note title..." value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} />
              <textarea className="input" rows={6} placeholder="Note markdown content..." value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowNoteModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
