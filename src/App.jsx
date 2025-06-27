import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EmailDetail from './pages/EmailDetail'
import Layout from './components/Layout'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user_id is in URL params (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('user_id')
    
    if (userId) {
      setUser({ id: userId })
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />} 
      />
      <Route 
        path="/dashboard" 
        element={
          user ? (
            <Layout user={user} setUser={setUser}>
              <Dashboard user={user} />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/email/:emailId" 
        element={
          user ? (
            <Layout user={user} setUser={setUser}>
              <EmailDetail user={user} />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App 