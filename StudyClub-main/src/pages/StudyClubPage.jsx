import { useEffect, useState } from 'react'
import {
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  Plus,
  Key,
  Trophy,
  BookOpen,
  MessageSquare,
  Share2,
  Copy,
  Crown,
  Check
} from 'lucide-react'
import { useClub } from '../contexts/ClubContext'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../services/db'
import toast from 'react-hot-toast'

export default function StudyClubPage() {
  const { clubs, activeClub, setActiveClub, reloadClubs, chatMessages, sendMessage } = useClub()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('room') // 'room' | 'chat' | 'notes' | 'leaderboard'
  const [leaderboard, setLeaderboard] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [joinCodeInput, setJoinCodeInput] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  // New club form
  const [newClubName, setNewClubName] = useState('')
  const [newClubDesc, setNewClubDesc] = useState('')

  // Virtual room controls
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    const data = await db.getLeaderboard()
    setLeaderboard(data)
  }

  const handleCreateClub = async (e) => {
    e.preventDefault()
    if (!newClubName.trim()) return
    try {
      const created = await db.createClub({
        name: newClubName,
        description: newClubDesc,
        owner_name: user?.name || 'Student'
      })
      await reloadClubs()
      setActiveClub(created)
      setShowCreateModal(false)
      setNewClubName('')
      setNewClubDesc('')
      toast.success(`🎉 Created ${created.name}! Share code: ${created.join_code}`)
    } catch (err) {
      toast.error('Failed to create study club')
    }
  }

  const handleJoinClub = async (e) => {
    e.preventDefault()
    if (!joinCodeInput.trim()) return
    try {
      const joined = await db.joinClubByCode(joinCodeInput)
      await reloadClubs()
      setActiveClub(joined)
      setShowJoinModal(false)
      setJoinCodeInput('')
      toast.success(`Welcome to ${joined.name}!`)
    } catch (err) {
      toast.error(err.message || 'Invalid join code')
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeClub) return
    sendMessage(activeClub.id, messageInput, user?.name || 'You', user?.avatar)
    setMessageInput('')
  }

  const currentClubMessages = activeClub ? (chatMessages[activeClub.id] || []) : []

  return (
    <div style={{ display: 'grid', gap: '1.75rem' }}>
      {/* ── HEADER & CLUB SELECTION BAR ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Collaborative Study Clubs</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Join live study rooms, chat with peers, share notes, and climb the leaderboard together.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setShowJoinModal(true)} className="btn btn-secondary">
              <Key size={16} /> Join via Code
            </button>
            <button type="button" onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Plus size={16} /> Create Study Club
            </button>
          </div>
        </div>

        {/* Club Selector Chips */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {clubs.map((club) => {
            const isSelected = activeClub?.id === club.id
            return (
              <button
                key={club.id}
                type="button"
                onClick={() => setActiveClub(club)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 99,
                  background: isSelected ? 'var(--accent)' : 'var(--bg-primary)',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  border: '1px solid ' + (isSelected ? 'var(--accent)' : 'var(--border)'),
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users size={16} />
                {club.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── ACTIVE CLUB WORKSPACE ── */}
      {activeClub ? (
        <div className="card" style={{ padding: '1.75rem' }}>
          {/* Club Info Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{activeClub.name}</h2>
                <span className="badge badge-accent">Code: {activeClub.join_code}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                {activeClub.description} • {activeClub.member_count || 12} Members
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(activeClub.join_code)
                toast.success('Join code copied to clipboard!')
              }}
              className="btn btn-secondary"
            >
              <Copy size={14} /> Copy Join Code
            </button>
          </div>

          {/* Workspace Tabs */}
          <div className="tabs-header">
            <button type="button" onClick={() => setActiveTab('room')} className={`tab-btn ${activeTab === 'room' ? 'active' : ''}`}>
              <Video size={16} style={{ display: 'inline', marginRight: 6 }} /> Virtual Study Room
            </button>
            <button type="button" onClick={() => setActiveTab('chat')} className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}>
              <MessageSquare size={16} style={{ display: 'inline', marginRight: 6 }} /> Group Chat ({currentClubMessages.length})
            </button>
            <button type="button" onClick={() => setActiveTab('leaderboard')} className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}>
              <Trophy size={16} style={{ display: 'inline', marginRight: 6 }} /> Club Leaderboard
            </button>
          </div>

          {/* ── TAB 1: VIRTUAL STUDY ROOM ── */}
          {activeTab === 'room' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}>
                {/* You */}
                <div style={{
                  height: 200,
                  background: camOn ? 'linear-gradient(135deg, #1A1814, #2A2720)' : 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--accent)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  overflow: 'hidden'
                }}>
                  {camOn ? (
                    <img src={user?.avatar} alt="You" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--accent)' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Camera Off</div>
                  )}
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                    You (Studying)
                  </div>
                </div>

                {/* Peer 1 */}
                <div style={{
                  height: 200,
                  background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Alex Rivera" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--accent-2)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                    Alex Rivera • 🟢 Focus Mode
                  </div>
                </div>

                {/* Peer 2 */}
                <div style={{
                  height: 200,
                  background: 'linear-gradient(135deg, #312E81, #1E1B4B)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" alt="Sophia Chen" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--accent-3)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                    Sophia Chen • 🎧 Lo-Fi Focus
                  </div>
                </div>
              </div>

              {/* Room Controls Bar */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  onClick={() => setMicOn(p => !p)}
                  className={`btn ${micOn ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {micOn ? <Mic size={16} /> : <MicOff size={16} />} {micOn ? 'Mic Unmuted' : 'Muted'}
                </button>
                <button
                  type="button"
                  onClick={() => setCamOn(p => !p)}
                  className={`btn ${camOn ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {camOn ? <Video size={16} /> : <VideoOff size={16} />} {camOn ? 'Camera On' : 'Camera Off'}
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 2: GROUP CHAT ── */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: 420 }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1rem' }}>
                {currentClubMessages.map((msg) => (
                  <div key={msg.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <img src={msg.avatar} alt={msg.sender} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', maxWidth: '80%' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{msg.sender}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10 }}>
                <input
                  className="input"
                  placeholder="Type a message to study club..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Send
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 3: LEADERBOARD ── */}
          {activeTab === 'leaderboard' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {leaderboard.slice(0, 3).map((item, idx) => (
                  <div key={item.user_id} className="card" style={{ padding: '1.25rem', textAlign: 'center', background: idx === 0 ? 'var(--accent-soft)' : 'var(--bg-card)' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                      <img src={item.avatar} alt={item.name} style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--accent)' }} />
                      <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--accent)', color: 'white', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        #{idx + 1}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-2)', fontWeight: 700, marginTop: 2 }}>{item.total_hours} Focus Hours</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{item.pomodoros_completed} Pomodoros • {item.streak} Day Streak</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Study Club Selected</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Select a club from above or create a new one to start collaborating!</p>
        </div>
      )}

      {/* ── CREATE CLUB MODAL ── */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Create New Study Club</h3>
            <form onSubmit={handleCreateClub} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Club Name</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Neuroscience & Brain Mechanics"
                  value={newClubName}
                  onChange={e => setNewClubName(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Description & Goal</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Describe your study group goals..."
                  value={newClubDesc}
                  onChange={e => setNewClubDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create & Join</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── JOIN CLUB MODAL ── */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Join Study Club via Code</h3>
            <form onSubmit={handleJoinClub} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Enter 6-Digit Join Code</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. QUANTUM42"
                  value={joinCodeInput}
                  onChange={e => setJoinCodeInput(e.target.value)}
                  style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowJoinModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Join Club</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
