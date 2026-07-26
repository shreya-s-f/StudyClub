import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import { ThemeProvider } from './src/contexts/ThemeContext'
import { ClubProvider } from './src/contexts/ClubContext'
import { PomodoroProvider } from './src/contexts/PomodoroContext'
import LoginPage from './src/pages/LoginPage'
import DashboardPage from './src/pages/DashboardPage'
import StudyClubPage from './src/pages/StudyClubPage'
import AIAssistantPage from './src/pages/AIAssistantPage'
import PlannerPage from './src/pages/PlannerPage'
import AppLayout from './src/components/layout/AppLayout'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clubs" element={<StudyClubPage />} />
        <Route path="/ai" element={<AIAssistantPage />} />
        <Route path="/planner" element={<PlannerPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ClubProvider>
            <PomodoroProvider>
              <AppRoutes />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    boxShadow: 'var(--shadow-md)'
                  }
                }}
              />
            </PomodoroProvider>
          </ClubProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
