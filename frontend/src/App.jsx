import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import TrackComplaint from './pages/TrackComplaint'
import ComplaintDetail from './pages/ComplaintDetail'
import AdminDashboard from './pages/AdminDashboard'
import AdminComplaints from './pages/AdminComplaints'
import AdminComplaintDetail from './pages/AdminComplaintDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Pages that should NOT show the sidebar
  const noSidebarPaths = ['/', '/login', '/register']
  const shouldShowSidebar = isAuthenticated && !noSidebarPaths.includes(location.pathname)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {shouldShowSidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <main className={`main-content ${shouldShowSidebar ? 'with-sidebar' : ''}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<TrackComplaint />} />

          {/* Citizen */}
          <Route path="/dashboard" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/submit" element={
            <ProtectedRoute><SubmitComplaint /></ProtectedRoute>
          } />
          <Route path="/complaint/:id" element={
            <ProtectedRoute><ComplaintDetail /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute adminOnly><AdminComplaints /></ProtectedRoute>
          } />
          <Route path="/admin/complaint/:id" element={
            <ProtectedRoute adminOnly><AdminComplaintDetail /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
              <h1 style={{ fontSize: '64px', color: 'var(--primary)' }}>404</h1>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                Page not found
              </p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'toast-custom',
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
