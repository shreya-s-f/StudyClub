import { useState } from 'react'
import {
  Sparkles,
  MessageSquare,
  Layers,
  HelpCircle,
  FileText,
  Send,
  RotateCw,
  Brain,
  Zap,
  ArrowRight,
  BookOpen,
  HelpCircle as QuestionIcon
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { aiService } from '../services/aiService'
import { db } from '../services/db'
import toast from 'react-hot-toast'

const SAMPLE_STUDY_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Quantum Mechanics — State Vectors & Tunneling PDF',
    category: 'Physics',
    content: `## Quantum State Vectors & Potential Barrier Tunneling

The quantum state of a physical system is represented by a complex wave function \\(\\Psi(x,t)\\). 

### Key Equation: Time-Dependent Schrödinger Equation
$$i\\hbar \\frac{\\partial}{\\partial t} \\Psi(x,t) = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(x,t) \\right] \\Psi(x,t)$$

### Tunneling Probability
When a particle encounters a potential energy barrier of height \\(V_0 > E\\) and width \\(L\\), the transmission coefficient \\(T\\) is approximately given by:
$$T \\approx e^{-2 k L}$$
where \\(k = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}\\).

**Real-world Applications**: Scanning Tunneling Microscopes (STM), Flash Memory chips, and Nuclear Fusion in Stars!`
  },
  {
    id: 'doc-2',
    title: 'Attention Mechanisms in Deep Neural Networks',
    category: 'Computer Science',
    content: `## Scaled Dot-Product & Multi-Head Self-Attention

Self-attention allows deep neural networks to dynamically assign weights to different sequence tokens regardless of distance.

### Scaled Dot-Product Attention Formula
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

### Multi-Head Attention
Instead of performing a single attention function, Multi-Head Attention maps queries, keys, and values to $h$ different linear projections:
$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$
where \\(\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)\\).`
  }
]

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('tutor') // 'tutor' | 'flashcards' | 'quiz' | 'summarizer' | 'reader'

  // Tab 1: AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: `### 👋 Hi there! I'm StudyBot, your personal AI Tutor.
How can I help you master your subjects today? 

Try asking me:
- *"Explain Quantum Tunneling with a simple analogy"*
- *"How does Multi-Head Attention work in Transformers?"*
- *"Give me a step-by-step solution to Michaelis-Menten Kinetics"*`
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Tab 2: Flashcards State
  const [fcTopic, setFcTopic] = useState('Quantum Physics & Wave Mechanics')
  const [fcDeck, setFcDeck] = useState([])
  const [fcCurrentIndex, setFcCurrentIndex] = useState(0)
  const [fcFlipped, setFcFlipped] = useState(false)
  const [fcLoading, setFcLoading] = useState(false)

  // Tab 3: Quiz State
  const [quizTopic, setQuizTopic] = useState('Computer Science & Machine Learning')
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizLoading, setQuizLoading] = useState(false)

  // Tab 4: Summarizer State
  const [summaryInput, setSummaryInput] = useState('')
  const [summaryOutput, setSummaryOutput] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)

  // Tab 5: Document Reader State
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_STUDY_DOCUMENTS[0])
  const [docAiAnswer, setDocAiAnswer] = useState('')
  const [docAiLoading, setDocAiLoading] = useState(false)

  // ── HANDLERS ──

  // AI Tutor Chat
  const handleSendChat = async (e) => {
    if (e) e.preventDefault()
    if (!chatInput.trim() || chatLoading) return

    const userMsg = chatInput
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const response = await aiService.askAITutor(userMsg)
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      toast.error('AI Tutor error, please try again')
    } finally {
      setChatLoading(false)
    }
  }

  // Flashcards Generator
  const handleGenerateFlashcards = async (e) => {
    if (e) e.preventDefault()
    if (!fcTopic.trim() || fcLoading) return
    setFcLoading(true)
    try {
      const cards = await aiService.generateFlashcards(fcTopic)
      setFcDeck(cards)
      setFcCurrentIndex(0)
      setFcFlipped(false)
      await db.createFlashcardDeck({ topic: fcTopic, cards })
      toast.success(`Generated ${cards.length} flashcards for "${fcTopic}"!`)
    } catch (err) {
      toast.error('Failed to generate flashcards')
    } finally {
      setFcLoading(false)
    }
  }

  // Quiz Generator
  const handleGenerateQuiz = async (e) => {
    if (e) e.preventDefault()
    if (!quizTopic.trim() || quizLoading) return
    setQuizLoading(true)
    setQuizSubmitted(false)
    setQuizAnswers({})
    try {
      const q = await aiService.generateQuiz(quizTopic)
      setQuizQuestions(q)
      toast.success(`Generated 5-question Quiz on "${quizTopic}"!`)
    } catch (err) {
      toast.error('Failed to generate quiz')
    } finally {
      setQuizLoading(false)
    }
  }

  // Summarizer
  const handleSummarize = async (e) => {
    if (e) e.preventDefault()
    if (!summaryInput.trim() || summaryLoading) return
    setSummaryLoading(true)
    try {
      const result = await aiService.summarizeNote(summaryInput)
      setSummaryOutput(result)
      toast.success('Summary generated!')
    } catch (err) {
      toast.error('Failed to summarize text')
    } finally {
      setSummaryLoading(false)
    }
  }

  // Document Reader AI Question
  const handleAskAboutDoc = async () => {
    if (!selectedDoc) return
    setDocAiLoading(true)
    try {
      const ans = await aiService.askAITutor(`Explain the main equations and takeaways of this document: "${selectedDoc.title}"`, selectedDoc.content)
      setDocAiAnswer(ans)
      toast.success('AI explained the document!')
    } catch (err) {
      toast.error('Failed to process document query')
    } finally {
      setDocAiLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: '1.75rem' }}>
      {/* ── PAGE HEADER ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-3-soft) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Study Toolkit</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Ask questions, generate flashcards, take interactive quizzes, summarize notes, and analyze study PDFs.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="tabs-header" style={{ marginBottom: 0, marginTop: '1.25rem' }}>
          <button type="button" onClick={() => setActiveTab('tutor')} className={`tab-btn ${activeTab === 'tutor' ? 'active' : ''}`}>
            <MessageSquare size={16} style={{ display: 'inline', marginRight: 6 }} /> AI Tutor Chat
          </button>
          <button type="button" onClick={() => setActiveTab('flashcards')} className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}>
            <Layers size={16} style={{ display: 'inline', marginRight: 6 }} /> Flashcard Generator
          </button>
          <button type="button" onClick={() => setActiveTab('quiz')} className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}>
            <HelpCircle size={16} style={{ display: 'inline', marginRight: 6 }} /> Interactive Quiz
          </button>
          <button type="button" onClick={() => setActiveTab('summarizer')} className={`tab-btn ${activeTab === 'summarizer' ? 'active' : ''}`}>
            <FileText size={16} style={{ display: 'inline', marginRight: 6 }} /> Note Summarizer
          </button>
          <button type="button" onClick={() => setActiveTab('reader')} className={`tab-btn ${activeTab === 'reader' ? 'active' : ''}`}>
            <BookOpen size={16} style={{ display: 'inline', marginRight: 6 }} /> Smart Doc Reader
          </button>
        </div>
      </div>

      {/* ── TAB 1: AI TUTOR CHAT ── */}
      {activeTab === 'tutor' && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 580 }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Brain size={18} />
                  </div>
                )}
                <div style={{
                  maxWidth: '82%',
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-primary)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  fontSize: '0.925rem',
                  lineHeight: 1.6
                }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={18} />
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '12px 18px', borderRadius: 16, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  StudyBot is thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: 10, marginTop: '1.25rem' }}>
            <input
              className="input"
              placeholder="Ask StudyBot any study or concept question..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button type="submit" disabled={chatLoading} className="btn btn-primary">
              <Send size={16} /> Ask AI
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 2: FLASHCARD GENERATOR & 3D FLIP PLAYER ── */}
      {activeTab === 'flashcards' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Generate Flashcard Deck</h3>
            <form onSubmit={handleGenerateFlashcards} style={{ display: 'flex', gap: 10 }}>
              <input
                className="input"
                placeholder="Enter topic or subject (e.g., Organic Chemistry, Calculus Derivatives)"
                value={fcTopic}
                onChange={e => setFcTopic(e.target.value)}
              />
              <button type="submit" disabled={fcLoading} className="btn btn-primary">
                <Zap size={16} /> {fcLoading ? 'Generating...' : 'Generate Deck'}
              </button>
            </form>
          </div>

          {fcDeck.length > 0 && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="badge badge-accent">Card {fcCurrentIndex + 1} of {fcDeck.length}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Click card to flip 🔄</span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setFcFlipped(p => !p)}
                style={{
                  minHeight: 220,
                  background: fcFlipped ? 'var(--accent-soft)' : 'var(--bg-primary)',
                  border: '2px solid ' + (fcFlipped ? 'var(--accent)' : 'var(--border)'),
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>
                    {fcFlipped ? 'ANSWER' : 'QUESTION'}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.5 }}>
                    {fcFlipped ? fcDeck[fcCurrentIndex]?.answer : fcDeck[fcCurrentIndex]?.question}
                  </div>
                </div>
              </div>

              {/* Card Nav Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={fcCurrentIndex === 0}
                  onClick={() => { setFcCurrentIndex(c => c - 1); setFcFlipped(false) }}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <button type="button" onClick={() => setFcFlipped(p => !p)} className="btn btn-ghost">
                  <RotateCw size={16} /> Flip Card
                </button>
                <button
                  type="button"
                  disabled={fcCurrentIndex === fcDeck.length - 1}
                  onClick={() => { setFcCurrentIndex(c => c + 1); setFcFlipped(false) }}
                  className="btn btn-primary"
                >
                  Next Card <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: INTERACTIVE QUIZ MASTER ── */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Generate Practice Quiz</h3>
            <form onSubmit={handleGenerateQuiz} style={{ display: 'flex', gap: 10 }}>
              <input
                className="input"
                placeholder="Enter topic for quiz (e.g. Cell Biology, Linear Algebra)"
                value={quizTopic}
                onChange={e => setQuizTopic(e.target.value)}
              />
              <button type="submit" disabled={quizLoading} className="btn btn-primary">
                <Brain size={16} /> {quizLoading ? 'Generating...' : 'Start Quiz'}
              </button>
            </form>
          </div>

          {quizQuestions.length > 0 && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Practice Quiz: {quizTopic}</h3>
                <span className="badge badge-purple">{quizQuestions.length} Questions</span>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {quizQuestions.map((q, qIdx) => {
                  const isCorrect = quizAnswers[qIdx] === q.answerIndex
                  return (
                    <div key={qIdx} style={{ padding: '1.25rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}>
                        {qIdx + 1}. {q.question}
                      </div>

                      <div style={{ display: 'grid', gap: 8 }}>
                        {q.options.map((opt, optIdx) => {
                          const selected = quizAnswers[qIdx] === optIdx
                          return (
                            <label
                              key={optIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 14px',
                                background: selected ? 'var(--accent-soft)' : 'var(--bg-card)',
                                border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--border)'),
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }}
                            >
                              <input
                                type="radio"
                                name={`q-${qIdx}`}
                                checked={selected}
                                onChange={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                disabled={quizSubmitted}
                                style={{ accentColor: 'var(--accent)' }}
                              />
                              {opt}
                            </label>
                          )
                        })}
                      </div>

                      {quizSubmitted && (
                        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: isCorrect ? 'var(--accent-2-soft)' : 'var(--accent-soft)', color: isCorrect ? 'var(--accent-2)' : 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                          {isCorrect ? '✅ Correct! ' : '❌ Incorrect. '}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuizSubmitted(true)
                    toast.success('Quiz submitted! Check your score below.')
                  }}
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem', width: '100%', padding: '12px' }}
                >
                  Submit Answers & Grade
                </button>
              ) : (
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    Your Score: {Object.keys(quizAnswers).filter(k => quizAnswers[k] === quizQuestions[k].answerIndex).length} / {quizQuestions.length}
                  </h3>
                  <button type="button" onClick={handleGenerateQuiz} className="btn btn-secondary" style={{ marginTop: 12 }}>
                    Try Another Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: NOTE SUMMARIZER ── */}
      {activeTab === 'summarizer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Paste Lecture Notes</h3>
            <textarea
              className="input"
              rows={12}
              placeholder="Paste raw textbook excerpt, lecture transcripts, or notes..."
              value={summaryInput}
              onChange={e => setSummaryInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSummarize}
              disabled={summaryLoading}
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              <Sparkles size={16} /> {summaryLoading ? 'Summarizing...' : 'Summarize Notes'}
            </button>
          </div>

          <div className="card" style={{ padding: '1.5rem', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>AI Summary & Key Takeaways</h3>
            {summaryOutput ? (
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <ReactMarkdown>{summaryOutput}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                Summary output will appear here after clicking "Summarize Notes".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: SMART DOCUMENT READER ── */}
      {activeTab === 'reader' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', height: 520, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Study PDF & Document Reader</h3>
              <button type="button" onClick={handleAskAboutDoc} disabled={docAiLoading} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                <Sparkles size={14} /> Explain PDF with AI
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <ReactMarkdown>{selectedDoc?.content}</ReactMarkdown>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', height: 520, overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>AI Document Analysis</h3>
            {docAiAnswer ? (
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <ReactMarkdown>{docAiAnswer}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center', marginTop: 140 }}>
                Click "Explain PDF with AI" to generate an intelligent analysis of the document equations and concepts.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
