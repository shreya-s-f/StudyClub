import { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { db } from '../services/db'

const PomodoroContext = createContext(null)

// Web Audio API synthesized sound generator for alerts & ambient noise
function playTimerChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3) // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.6) // G5
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 1.2)
  } catch (err) {}
}

export function PomodoroProvider({ children }) {
  const [mode, setMode] = useState('work') // 'work' | 'shortBreak' | 'longBreak'
  const [durationMinutes, setDurationMinutes] = useState(25)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [soundTrack, setSoundTrack] = useState('none') // 'none' | 'rain' | 'lofi' | 'coffee'
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0)

  const timerRef = useRef(null)

  // Sync initial duration when mode changes
  const switchMode = (newMode) => {
    setIsRunning(false)
    setMode(newMode)
    let minutes = 25
    if (newMode === 'shortBreak') minutes = 5
    if (newMode === 'longBreak') minutes = 15
    setDurationMinutes(minutes)
    setTimeLeftSeconds(minutes * 60)
  }

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsRunning(false)
            playTimerChime()

            if (mode === 'work') {
              setCompletedSessionsCount(c => c + 1)
              db.recordPomodoroSession(durationMinutes)
              toast.success(`🎉 Focus session completed! Time for a break. (+${durationMinutes} mins)`)
              switchMode('shortBreak')
            } else {
              toast.success('Break finished! Ready to focus again?')
              switchMode('work')
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, mode, durationMinutes])

  const toggleTimer = () => setIsRunning(prev => !prev)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeftSeconds(durationMinutes * 60)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <PomodoroContext.Provider value={{
      mode,
      switchMode,
      durationMinutes,
      timeLeftSeconds,
      formattedTime: formatTime(timeLeftSeconds),
      isRunning,
      toggleTimer,
      resetTimer,
      activeTask,
      setActiveTask,
      soundTrack,
      setSoundTrack,
      completedSessionsCount
    }}>
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider')
  }
  return context
}
