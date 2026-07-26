import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/db'

const ClubContext = createContext(null)

const INITIAL_MESSAGES = {
  'club-1': [
    { id: 'm1', sender: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', text: 'Welcome to the Quantum Physics Guild! Remember we have our wave mechanics review tomorrow at 4 PM.', time: '10:15 AM' },
    { id: 'm2', sender: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', text: 'Just uploaded the Transformer and Quantum Tunneling notes to the shared library!', time: '11:30 AM' }
  ],
  'club-2': [
    { id: 'm3', sender: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', text: 'Hey ML Lab members! PyTorch code review starts in 30 mins in the virtual room.', time: '02:00 PM' }
  ]
}

export function ClubProvider({ children }) {
  const [clubs, setClubs] = useState([])
  const [activeClub, setActiveClub] = useState(null)
  const [activeRoom, setActiveRoom] = useState(null) // null or active club object for study room session
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES)
  const [loading, setLoading] = useState(true)

  const reloadClubs = async () => {
    try {
      const list = await db.getClubs()
      setClubs(list)
      if (list.length > 0 && !activeClub) {
        setActiveClub(list[0])
      }
    } catch (err) {
      console.error('Error loading clubs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadClubs()
  }, [])

  const sendMessage = (clubId, text, senderName = 'You', avatarUrl) => {
    const newMessage = {
      id: 'm-' + Date.now(),
      sender: senderName,
      avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages(prev => ({
      ...prev,
      [clubId]: [...(prev[clubId] || []), newMessage]
    }))
  }

  return (
    <ClubContext.Provider value={{
      clubs,
      activeClub,
      setActiveClub,
      activeRoom,
      setActiveRoom,
      chatMessages,
      sendMessage,
      reloadClubs,
      loading
    }}>
      {children}
    </ClubContext.Provider>
  )
}

export function useClub() {
  const context = useContext(ClubContext)
  if (!context) {
    throw new Error('useClub must be used within ClubProvider')
  }
  return context
}
