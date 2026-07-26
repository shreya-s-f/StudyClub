import { Trophy, Flame, Clock, Brain, Users, CheckSquare, X, Award, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function BadgesModal({ isOpen, onClose }) {
  const { user } = useAuth()
  if (!isOpen) return null

  const badges = [
    {
      id: 'badge-1',
      title: '7-Day Focus Streak',
      desc: 'Maintain active study sessions for 7 consecutive days',
      icon: Flame,
      color: '#FF6B35',
      unlocked: (user?.streak || 0) >= 7,
      progress: Math.min(100, Math.round(((user?.streak || 0) / 7) * 100))
    },
    {
      id: 'badge-2',
      title: 'Pomodoro Master',
      desc: 'Complete 50+ timed focus pomodoro cycles',
      icon: Clock,
      color: '#2D6A4F',
      unlocked: (user?.pomodoros || 0) >= 50,
      progress: Math.min(100, Math.round(((user?.pomodoros || 0) / 50) * 100))
    },
    {
      id: 'badge-3',
      title: 'AI Scholar',
      desc: 'Generate 10+ AI study flashcard decks or practice quizzes',
      icon: Brain,
      color: '#4A3AFF',
      unlocked: true,
      progress: 100
    },
    {
      id: 'badge-4',
      title: 'Club Pioneer',
      desc: 'Join or found a study club and participate in study rooms',
      icon: Users,
      color: '#E8521A',
      unlocked: true,
      progress: 100
    },
    {
      id: 'badge-5',
      title: 'Task Conqueror',
      desc: 'Complete 25+ study assignments & project milestones',
      icon: CheckSquare,
      color: '#10B981',
      unlocked: (user?.level || 1) >= 4,
      progress: 85
    }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Student Achievements & Badges</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified academic milestones</div>
            </div>
          </div>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ display: 'grid', gap: 12, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
          {badges.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: b.unlocked ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                  border: '1px solid ' + (b.unlocked ? 'var(--border)' : 'var(--border-strong)'),
                  borderRadius: 'var(--radius-md)',
                  opacity: b.unlocked ? 1 : 0.65
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: b.unlocked ? b.color : '#6B6760',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: b.unlocked ? 'var(--shadow-sm)' : 'none'
                }}>
                  <Icon size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.title}</div>
                    {b.unlocked ? (
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}><ShieldCheck size={12} /> UNLOCKED</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{b.progress}% COMPLETE</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: 2 }}>{b.desc}</div>

                  {/* Progress Bar */}
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${b.progress}%`, height: '100%', background: b.color, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
