import { supabase, isSupabaseConfigured } from './supabaseClient'

const STORAGE_KEYS = {
  CLUBS: 'studyclub_db_clubs',
  CLUB_MEMBERS: 'studyclub_db_members',
  TASKS: 'studyclub_db_tasks',
  POMODORO: 'studyclub_db_pomodoro',
  NOTES: 'studyclub_db_notes',
  FLASHCARDS: 'studyclub_db_flashcards',
  CALENDAR: 'studyclub_db_calendar',
  LEADERBOARD: 'studyclub_db_leaderboard'
}

// Initial Mock Seed Data
const DEFAULT_CLUBS = [
  {
    id: 'club-1',
    name: 'Quantum Physics Guild',
    join_code: 'QUANTUM42',
    owner_id: 'user-1',
    owner_name: 'Alex Rivera',
    description: 'Deep dive into Quantum Mechanics, Special Relativity, and Thermodynamics.',
    member_count: 14,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'club-2',
    name: 'AI & Machine Learning Lab',
    join_code: 'NEURAL2026',
    owner_id: 'user-2',
    owner_name: 'Sophia Chen',
    description: 'Building neural networks, transformers, computer vision, and AI agents.',
    member_count: 22,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'club-3',
    name: 'Pre-Med Study Circle',
    join_code: 'ANATOMY101',
    owner_id: 'user-3',
    owner_name: 'Marcus Vance',
    description: 'MCAT preparation, BioChem summary notes, and Medical Physiology reviews.',
    member_count: 18,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'club-4',
    name: 'Full-Stack Dev Hub',
    join_code: 'DEVHUB88',
    owner_id: 'user-4',
    owner_name: 'Elena Rostova',
    description: 'Mastering React, Node.js, Systems Design, and collaborative code reviews.',
    member_count: 31,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  }
]

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    user_id: 'current-user',
    club_id: 'club-1',
    club_name: 'Quantum Physics Guild',
    title: 'Finish Wave Mechanics & Schrödinger Equation Assignment',
    is_completed: false,
    status: 'in-progress',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: 'task-2',
    user_id: 'current-user',
    club_id: 'club-2',
    club_name: 'AI & Machine Learning Lab',
    title: 'Implement Multi-Head Attention from scratch in PyTorch',
    is_completed: false,
    status: 'todo',
    priority: 'high',
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: 'task-3',
    user_id: 'current-user',
    club_id: 'club-3',
    club_name: 'Pre-Med Study Circle',
    title: 'Complete 50 MCAT Practice Questions on Enzyme Kinetics',
    is_completed: true,
    status: 'completed',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'task-4',
    user_id: 'current-user',
    club_id: 'club-4',
    club_name: 'Full-Stack Dev Hub',
    title: 'Review System Design architecture for real-time WebSockets',
    is_completed: false,
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: 'task-5',
    user_id: 'current-user',
    club_id: 'club-1',
    club_name: 'Quantum Physics Guild',
    title: 'Read Chapter 6: Quantum Tunneling & Infinite Potential Well',
    is_completed: true,
    status: 'completed',
    priority: 'low',
    due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  }
]

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    user_id: 'current-user',
    club_id: 'club-1',
    club_name: 'Quantum Physics Guild',
    title: 'Quantum Mechanics — Key Axioms & Postulates',
    type: 'text',
    content: `# Quantum Mechanics Summary Notes

## 1. Wave Function & Superposition
- The state of a physical system is represented by a wave function **ψ(x, t)** in Hilbert space.
- Superposition principle states: \\|ψ\\⟩ = c₁\\|ψ₁\\⟩ + c₂\\|ψ₂\\⟩ where |c₁|² + |c₂|² = 1.

## 2. Born Rule
- Probability density of finding particle at position x is **P(x) = |ψ(x)|²**.

## 3. Heisenberg Uncertainty Principle
- **Δx · Δp ≥ ℏ / 2**
- Implies conjugate variables (like position & momentum) cannot both be simultaneously measured with arbitrary precision.`,
    tags: ['Physics', 'Quantum', 'Exam Prep'],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'note-2',
    user_id: 'current-user',
    club_id: 'club-2',
    club_name: 'AI & Machine Learning Lab',
    title: 'Transformer Architecture Breakdown (Vaswani et al.)',
    type: 'text',
    content: `# Transformer Neural Network Architecture

- **Self-Attention**: Scaled Dot-Product Attention:
  $$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$
- **Multi-Head Attention**: Allows model to jointly attend to information from different representation subspaces at different positions.
- **Positional Encoding**: Uses sine and cosine functions of different frequencies to inject word order.
- **Layer Normalization & Residual Connections**: Prevents vanishing gradients in deep stacks (e.g. 12 or 24 layers).`,
    tags: ['AI', 'Deep Learning', 'PyTorch'],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'note-3',
    user_id: 'current-user',
    club_id: 'club-3',
    club_name: 'Pre-Med Study Circle',
    title: 'Biochemistry — Glycolysis & Krebs Cycle Cheat Sheet',
    type: 'text',
    content: `# Metabolism & Cellular Respiration

### Key Steps in Glycolysis (Cytoplasm)
1. Hexokinase (Glucose → G6P) — *Rate limiting step 1*
2. Phosphofructokinase-1 (PFK-1: F6P → F1,6BP) — *Major committed step!*
3. Pyruvate Kinase (PEP → Pyruvate) — Yields 2 ATP + 2 NADH per glucose.

### Citric Acid Cycle (Mitochondrial Matrix)
- Acetyl-CoA + Oxaloacetate → Citrate (via Citrate Synthase).
- Net yield per turn: 3 NADH, 1 FADH2, 1 GTP.`,
    tags: ['Biology', 'MCAT', 'BioChem'],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  }
]

const DEFAULT_FLASHCARDS = [
  {
    id: 'fc-1',
    user_id: 'current-user',
    topic: 'Machine Learning & Neural Networks',
    cards: [
      { question: 'What is Overfitting and how can it be prevented?', answer: 'Overfitting occurs when a model learns noise in training data. Prevent it via L1/L2 regularization, dropout, early stopping, or increasing dataset size.' },
      { question: 'What is the role of Activation Functions in Neural Networks?', answer: 'They introduce non-linearity, enabling the network to learn complex non-linear decision boundaries.' },
      { question: 'Explain Vanishing Gradient Problem.', answer: 'Gradients become extremely small during backpropagation in deep networks, slowing or stopping weight updates. Solved with ReLU, Residual Connections (ResNets), and LayerNorm.' },
      { question: 'What is the difference between Supervised and Unsupervised Learning?', answer: 'Supervised uses labeled datasets (input-output pairs), whereas Unsupervised learns patterns/clusters from unlabeled data.' },
      { question: 'What is Cross-Entropy Loss?', answer: 'A loss function measuring the performance of a classification model whose output is a probability value between 0 and 1.' }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'fc-2',
    user_id: 'current-user',
    topic: 'Organic Chemistry & BioChem',
    cards: [
      { question: 'What is an SN2 Reaction Mechanism?', answer: 'Bimolecular nucleophilic substitution taking place in one concerted step with inversion of stereochemistry at the chiral center.' },
      { question: 'What is the Isoelectric Point (pI) of an amino acid?', answer: 'The pH at which a molecule carries no net electrical charge (zwitterion state).' },
      { question: 'Define Allosteric Inhibition.', answer: 'Inhibitor binds to a site other than the active site (allosteric site), changing enzyme conformation and lowering substrate affinity.' }
    ],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  }
]

const DEFAULT_CALENDAR = [
  {
    id: 'cal-1',
    user_id: 'current-user',
    club_id: 'club-1',
    club_name: 'Quantum Physics Guild',
    title: 'Midterm Exam — Quantum Physics',
    event_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '12:00',
    type: 'exam',
    color: 'accent',
    description: 'Covering Chapters 1-5: Wave Mechanics, Superposition, Schrödinger Equation.'
  },
  {
    id: 'cal-2',
    user_id: 'current-user',
    club_id: 'club-2',
    club_name: 'AI & Machine Learning Lab',
    title: 'Transformer Architecture Live Code Workshop',
    event_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    start_time: '16:00',
    end_time: '18:00',
    type: 'study',
    color: 'accent-2',
    description: 'Group session in virtual study room: coding attention heads together.'
  },
  {
    id: 'cal-3',
    user_id: 'current-user',
    club_id: 'club-3',
    club_name: 'Pre-Med Study Circle',
    title: 'MCAT Practice Test & Review Session',
    event_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '17:00',
    type: 'study',
    color: 'accent-3',
    description: 'Timed practice exam followed by group review of incorrect answers.'
  }
]

const DEFAULT_LEADERBOARD = [
  { rank: 1, user_id: 'user-1', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', total_hours: 48.5, pomodoros_completed: 116, quiz_score: 98, streak: 14 },
  { rank: 2, user_id: 'user-2', name: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', total_hours: 42.0, pomodoros_completed: 101, quiz_score: 94, streak: 11 },
  { rank: 3, user_id: 'current-user', name: 'You (Student)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80', total_hours: 36.5, pomodoros_completed: 88, quiz_score: 91, streak: 7 },
  { rank: 4, user_id: 'user-3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', total_hours: 31.2, pomodoros_completed: 74, quiz_score: 87, streak: 5 },
  { rank: 5, user_id: 'user-4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', total_hours: 28.0, pomodoros_completed: 67, quiz_score: 85, streak: 4 }
]

// Helper for local storage reading/writing
function getLocalItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue
    }
    return JSON.parse(raw)
  } catch (err) {
    return defaultValue
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('LocalStorage set error:', err)
  }
}

export const db = {
  // ── CLUBS ──
  async getClubs() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('clubs').select('*').order('created_at', { ascending: false })
      if (!error && data) return data
    }
    return getLocalItem(STORAGE_KEYS.CLUBS, DEFAULT_CLUBS)
  },

  async createClub({ name, description, owner_name = 'You' }) {
    const joinCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase() + Math.floor(100 + Math.random() * 900)
    const newClub = {
      id: 'club-' + Date.now(),
      name,
      join_code: joinCode,
      owner_id: 'current-user',
      owner_name,
      description: description || 'Study club created by ' + owner_name,
      member_count: 1,
      created_at: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('clubs').insert([{ name, join_code: joinCode, description }]).select().single()
      if (!error && data) return data
    }

    const clubs = getLocalItem(STORAGE_KEYS.CLUBS, DEFAULT_CLUBS)
    const updated = [newClub, ...clubs]
    setLocalItem(STORAGE_KEYS.CLUBS, updated)
    return newClub
  },

  async joinClubByCode(code) {
    const clubs = await this.getClubs()
    const target = clubs.find(c => c.join_code.trim().toUpperCase() === code.trim().toUpperCase())
    if (!target) throw new Error('Invalid Study Club code! Please check and try again.')
    target.member_count = (target.member_count || 1) + 1
    const updated = clubs.map(c => c.id === target.id ? target : c)
    setLocalItem(STORAGE_KEYS.CLUBS, updated)
    return target
  },

  // ── TASKS ──
  async getTasks() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
      if (!error && data) return data
    }
    return getLocalItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
  },

  async createTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now(),
      user_id: 'current-user',
      is_completed: false,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      created_at: new Date().toISOString(),
      ...taskData
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('tasks').insert([newTask]).select().single()
      if (!error && data) return data
    }

    const tasks = getLocalItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
    const updated = [newTask, ...tasks]
    setLocalItem(STORAGE_KEYS.TASKS, updated)
    return newTask
  },

  async updateTask(id, updates) {
    if (isSupabaseConfigured) {
      await supabase.from('tasks').update(updates).eq('id', id)
    }
    const tasks = getLocalItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    setLocalItem(STORAGE_KEYS.TASKS, updated)
    return updated.find(t => t.id === id)
  },

  async deleteTask(id) {
    if (isSupabaseConfigured) {
      await supabase.from('tasks').delete().eq('id', id)
    }
    const tasks = getLocalItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
    const updated = tasks.filter(t => t.id !== id)
    setLocalItem(STORAGE_KEYS.TASKS, updated)
  },

  // ── NOTES ──
  async getNotes() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
      if (!error && data) return data
    }
    return getLocalItem(STORAGE_KEYS.NOTES, DEFAULT_NOTES)
  },

  async createNote(noteData) {
    const newNote = {
      id: 'note-' + Date.now(),
      user_id: 'current-user',
      created_at: new Date().toISOString(),
      type: 'text',
      tags: ['Study'],
      ...noteData
    }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('notes').insert([newNote]).select().single()
      if (!error && data) return data
    }
    const notes = getLocalItem(STORAGE_KEYS.NOTES, DEFAULT_NOTES)
    const updated = [newNote, ...notes]
    setLocalItem(STORAGE_KEYS.NOTES, updated)
    return newNote
  },

  async deleteNote(id) {
    const notes = getLocalItem(STORAGE_KEYS.NOTES, DEFAULT_NOTES)
    const updated = notes.filter(n => n.id !== id)
    setLocalItem(STORAGE_KEYS.NOTES, updated)
  },

  // ── FLASHCARDS ──
  async getFlashcards() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('flashcards').select('*').order('created_at', { ascending: false })
      if (!error && data) return data
    }
    return getLocalItem(STORAGE_KEYS.FLASHCARDS, DEFAULT_FLASHCARDS)
  },

  async createFlashcardDeck(deck) {
    const newDeck = {
      id: 'fc-' + Date.now(),
      user_id: 'current-user',
      created_at: new Date().toISOString(),
      ...deck
    }
    const decks = getLocalItem(STORAGE_KEYS.FLASHCARDS, DEFAULT_FLASHCARDS)
    const updated = [newDeck, ...decks]
    setLocalItem(STORAGE_KEYS.FLASHCARDS, updated)
    return newDeck
  },

  // ── CALENDAR ──
  async getCalendarEvents() {
    return getLocalItem(STORAGE_KEYS.CALENDAR, DEFAULT_CALENDAR)
  },

  async createCalendarEvent(eventData) {
    const newEvent = {
      id: 'cal-' + Date.now(),
      user_id: 'current-user',
      type: 'study',
      color: 'accent',
      ...eventData
    }
    const events = getLocalItem(STORAGE_KEYS.CALENDAR, DEFAULT_CALENDAR)
    const updated = [...events, newEvent]
    setLocalItem(STORAGE_KEYS.CALENDAR, updated)
    return newEvent
  },

  async deleteCalendarEvent(id) {
    const events = getLocalItem(STORAGE_KEYS.CALENDAR, DEFAULT_CALENDAR)
    const updated = events.filter(e => e.id !== id)
    setLocalItem(STORAGE_KEYS.CALENDAR, updated)
  },

  // ── LEADERBOARD ──
  async getLeaderboard() {
    return getLocalItem(STORAGE_KEYS.LEADERBOARD, DEFAULT_LEADERBOARD)
  },

  async recordPomodoroSession(durationMinutes = 25) {
    const leaderboard = getLocalItem(STORAGE_KEYS.LEADERBOARD, DEFAULT_LEADERBOARD)
    const updated = leaderboard.map(user => {
      if (user.user_id === 'current-user') {
        const addedHours = Number((durationMinutes / 60).toFixed(2))
        return {
          ...user,
          pomodoros_completed: user.pomodoros_completed + 1,
          total_hours: Number((user.total_hours + addedHours).toFixed(2))
        }
      }
      return user
    })
    setLocalItem(STORAGE_KEYS.LEADERBOARD, updated)
  }
}
