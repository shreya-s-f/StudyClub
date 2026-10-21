import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  CalendarCheck,
  Trophy,
  ShieldAlert,
  Search,
  CheckCircle2,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  HelpCircle,
  Zap,
  Info,
  Check
} from 'lucide-react'
import {
  PROJECT_METADATA,
  PROBLEM_STATEMENT,
  PROJECT_STATS,
  MODULES_BREAKDOWN,
  TECH_STACK_EXPLAINED,
  USER_GUIDES,
  DEMO_CREDENTIALS,
  FAQS
} from '../data/projectGuideData'
import toast from 'react-hot-toast'

export default function ProjectGuidePage() {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'modules' | 'architecture' | 'userguide' | 'faq'
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const [copiedKey, setCopiedKey] = useState('')

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success(`Copied "${text}" to clipboard!`)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  const handleDownloadSummary = () => {
    const markdownContent = `# ${PROJECT_METADATA.name} — Complete Project Guide
*${PROJECT_METADATA.tagline}*

## 1. Executive Summary
${PROJECT_METADATA.summary}

## 2. Problem & Solution
${PROBLEM_STATEMENT.description}

**Solution:**
${PROBLEM_STATEMENT.solution}

## 3. Core Modules
${MODULES_BREAKDOWN.map(m => `### ${m.number}. ${m.name}\n- **What it does:** ${m.whatItDoes}\n- **Why it matters:** ${m.whyItMatters}\n- **Key features:**\n${m.features.map(f => `  - ${f}`).join('\n')}`).join('\n\n')}

## 4. Technology Stack (Plain English)
${TECH_STACK_EXPLAINED.map(t => `- **${t.tech}**: ${t.simpleExplanation}`).join('\n')}

## 5. Demo Credentials
${DEMO_CREDENTIALS.map(c => `- **${c.role}**: Username: \`${c.username}\`, Password: \`${c.password}\`, Passcode: \`${c.passcode}\``).join('\n')}
`
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'StudyClub_Project_Guide.md')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloaded StudyClub_Project_Guide.md!')
  }

  const handleDownloadJson = () => {
    const jsonPayload = {
      project: PROJECT_METADATA,
      problem: PROBLEM_STATEMENT,
      stats: PROJECT_STATS,
      modules: MODULES_BREAKDOWN,
      techStack: TECH_STACK_EXPLAINED,
      demoCredentials: DEMO_CREDENTIALS,
      faqs: FAQS
    }
    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'StudyClub_Project_Data.json')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloaded StudyClub_Project_Data.json!')
  }

  // Filter modules and FAQs by search query
  const queryLower = searchQuery.toLowerCase().trim()
  const filteredModules = MODULES_BREAKDOWN.filter(m =>
    !queryLower ||
    m.name.toLowerCase().includes(queryLower) ||
    m.shortSummary.toLowerCase().includes(queryLower) ||
    m.whatItDoes.toLowerCase().includes(queryLower) ||
    m.features.some(f => f.toLowerCase().includes(queryLower))
  )

  const filteredFaqs = FAQS.filter(faq =>
    !queryLower ||
    faq.question.toLowerCase().includes(queryLower) ||
    faq.answer.toLowerCase().includes(queryLower)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* ── HERO HEADER ── */}
      <div
        className="card"
        style={{
          padding: '2.25rem',
          background: 'linear-gradient(135deg, rgba(232, 82, 26, 0.08) 0%, rgba(74, 58, 255, 0.08) 100%)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                background: 'linear-gradient(135deg, var(--accent), #FF8555)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <BookOpen size={30} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="badge badge-accent" style={{ fontWeight: 800 }}>PROJECT GUIDE</span>
                <span className="badge badge-purple" style={{ fontWeight: 700 }}>Version {PROJECT_METADATA.version}</span>
                <span className="badge badge-green">Simple English Documentation</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                StudyClub — Complete Project Knowledge Base
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4, maxWidth: 680 }}>
                {PROJECT_METADATA.summary}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadSummary}
              className="btn btn-secondary"
              title="Download clean Markdown summary"
            >
              <Download size={15} /> Markdown Guide
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="btn btn-secondary"
              title="Download structured JSON dataset"
            >
              <Download size={15} /> Export JSON
            </button>
            <Link to="/clubs" className="btn btn-primary">
              <Zap size={15} /> Open Live App
            </Link>
          </div>
        </div>

        {/* Search Bar Across Entire Project */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 42, height: 46, fontSize: '0.95rem' }}
            placeholder="Search anything about StudyClub (e.g. 'admin passcode', 'virtual rooms', 'pomodoro', 'how to join club')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 8, overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'overview' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'overview' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'overview' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Info size={16} /> Overview & Story
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'modules' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'modules' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'modules' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Layers size={16} /> 7 Core Modules ({MODULES_BREAKDOWN.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'architecture' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'architecture' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'architecture' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Sparkles size={16} /> Tech & Architecture
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('userguide')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'userguide' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'userguide' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'userguide' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <CheckCircle2 size={16} /> Quick Start & Testing
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'faq' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'faq' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'faq' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <HelpCircle size={16} /> FAQ & Answers ({FAQS.length})
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      {/* 1. OVERVIEW & STORY */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {PROJECT_STATS.map((stat, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Problem vs Solution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #E63946' }}>
              <div className="badge" style={{ background: '#FFEBEB', color: '#D90429', marginBottom: 10 }}>
                THE REAL PROBLEM
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>{PROBLEM_STATEMENT.subtitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {PROBLEM_STATEMENT.description}
              </p>
              <div style={{ marginTop: 14, padding: 12, background: 'rgba(230, 57, 70, 0.06)', borderRadius: 8, fontSize: '0.8rem', color: '#B7094C' }}>
                ⚡ <strong>Result:</strong> Constant tab switching wastes up to 30 minutes every study session.
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-2)' }}>
              <div className="badge badge-green" style={{ marginBottom: 10 }}>
                THE STUDYCLUB SOLUTION
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>All-In-One Unified Workspace</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {PROBLEM_STATEMENT.solution}
              </p>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--accent-2-soft)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--accent-2)' }}>
                ✨ <strong>Result:</strong> Study sessions are uninterrupted, collaborative, and rewarding.
              </div>
            </div>
          </div>

          {/* Who is StudyClub for? */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12 }}>Who Benefits Most from StudyClub?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>🎓 College & High School Students</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Organize midterms, study for MCAT/Engineering exams, and study with classmates in virtual rooms.
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>💻 Self-Learners & Coders</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Track daily Pomodoro streaks, generate AI quizzes on Python or algorithms, and keep study notes organized.
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>🛡️ Educators & Study Club Leads</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Create official study circles, broadcast platform announcements, and moderate student activities.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CORE MODULES BREAKDOWN */}
      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredModules.length}</strong> core modules. Click any <strong>"Try It Live"</strong> button to test that module immediately!
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-accent">01 Auth</span>
              <span className="badge badge-accent">02 Clubs</span>
              <span className="badge badge-accent">03 AI</span>
              <span className="badge badge-accent">04 Timer</span>
              <span className="badge badge-accent">05 Planner</span>
              <span className="badge badge-accent">06 Badges</span>
              <span className="badge badge-accent">07 Admin</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {filteredModules.map((m) => (
              <div key={m.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-secondary))',
                        border: '1px solid var(--border)',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem'
                      }}
                    >
                      {m.number}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{m.name}</h3>
                        <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{m.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {m.shortSummary}
                      </div>
                    </div>
                  </div>

                  <Link to={m.tryItLink} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                    {m.tryItLabel} <ExternalLink size={13} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      🎯 What it does in simple words:
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>{m.whatItDoes}</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--accent-2)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      💡 Why students love it:
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>{m.whyItMatters}</p>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Key Capabilities Included:
                  </div>
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px 16px', paddingLeft: 18, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {m.features.map((f, idx) => (
                      <li key={idx} style={{ lineHeight: 1.5 }}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TECH & ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6 }}>How StudyClub is Built (Plain English)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No confusing technical jargon. Here is how the software works behind the scenes in simple, accessible language.
            </p>

            {/* Architecture Diagram in Simple English */}
            <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>
                Visual Data Flow:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, textAlign: 'center' }}>
                <div style={{ flex: 1, minWidth: 140, padding: 12, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.25rem' }}>💻</div>
                  <strong style={{ fontSize: '0.85rem' }}>1. User Interface</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>React 18 + Vite SPA</div>
                </div>

                <div style={{ color: 'var(--text-muted)', fontWeight: 800 }}>➔</div>

                <div style={{ flex: 1, minWidth: 140, padding: 12, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.25rem' }}>🧠</div>
                  <strong style={{ fontSize: '0.85rem' }}>2. Global State</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auth & Club Contexts</div>
                </div>

                <div style={{ color: 'var(--text-muted)', fontWeight: 800 }}>➔</div>

                <div style={{ flex: 1, minWidth: 140, padding: 12, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.25rem' }}>🗄️</div>
                  <strong style={{ fontSize: '0.85rem' }}>3. Hybrid Storage</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supabase + LocalStorage</div>
                </div>

                <div style={{ color: 'var(--text-muted)', fontWeight: 800 }}>➔</div>

                <div style={{ flex: 1, minWidth: 140, padding: 12, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.25rem' }}>🤖</div>
                  <strong style={{ fontSize: '0.85rem' }}>4. AI Service</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gemini + Local Engine</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {TECH_STACK_EXPLAINED.map((item, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="badge badge-accent" style={{ width: 'fit-content', fontSize: '0.75rem' }}>{item.tech}</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.simpleExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. USER GUIDE & DEMO TESTING */}
      {activeTab === 'userguide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Demo Credentials Table */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Zap size={22} color="var(--accent)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pre-Configured Demo Accounts (Ready to Test!)</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Use these credentials to sign in immediately without having to create an account from scratch:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {DEMO_CREDENTIALS.map((cred, i) => (
                <div key={i} style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className={`badge ${cred.role.includes('Admin') ? 'badge-accent' : 'badge-green'}`} style={{ fontWeight: 800 }}>
                      {cred.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${cred.username} / ${cred.password}`, `cred-${i}`)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      {copiedKey === `cred-${i}` ? <Check size={12} /> : <Copy size={12} />} Copy
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: 6, fontSize: '0.85rem' }}>
                    <div><strong>Username:</strong> <code style={{ color: 'var(--accent)' }}>@{cred.username}</code></div>
                    <div><strong>Email:</strong> <code>{cred.email}</code></div>
                    <div><strong>Password:</strong> <code>{cred.password}</code></div>
                    <div><strong>Passcode:</strong> <code>{cred.passcode}</code></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{cred.privileges}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Onboarding */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {USER_GUIDES.map((guide, idx) => (
              <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={18} color="var(--accent-2)" /> How to Test as a {guide.role}
                </h4>
                <ol style={{ paddingLeft: 20, display: 'grid', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {guide.steps.map((step, sIdx) => (
                    <li key={sIdx} style={{ lineHeight: 1.5 }}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Quick Evaluator / Grader Checklist */}
          <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--accent)', background: 'var(--accent-soft)' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
              📋 2-Minute Feature Testing Checklist (For Teachers & Evaluators)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--accent)" /> <span>Sign in with 1-click Demo Admin</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--accent)" /> <span>Visit the Admin Console at /admin</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--accent)" /> <span>Post a platform broadcast alert</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--accent)" /> <span>Start the Pomodoro timer in header</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--accent)" /> <span>Generate a 3D flashcard deck</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--accent)" /> <span>Try creating/joining a study club</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {activeTab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Frequently Asked Questions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                Quick answers to everything you or an evaluator might ask about StudyClub.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setOpenFaqIndex('all')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => setOpenFaqIndex(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              >
                Collapse All
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {filteredFaqs.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No questions matched "{searchQuery}". Try searching for words like "admin", "timer", or "database".
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === 'all' || openFaqIndex === idx
                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition)'
                    }}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>Q:</span> {faq.question}
                      </h4>
                      {isOpen ? <ChevronUp size={18} color="var(--accent)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </div>
                    {isOpen && (
                      <div style={{ marginTop: 10, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                        <strong style={{ color: 'var(--accent-2)' }}>Answer: </strong>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
