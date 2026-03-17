import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { HiOutlineSun, HiOutlineMoon, HiOutlineComputerDesktop, HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2'

export default function Navbar() {
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth()
  const { mode, setMode, theme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const themeRef = useRef(null)
  const navigate = useNavigate()

  // Close theme dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
    setMobileOpen(false)
  }

  const themeIcon = theme === 'dark' ? <HiOutlineMoon /> : <HiOutlineSun />

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <HiOutlineSun /> },
    { value: 'dark', label: 'Dark', icon: <HiOutlineMoon /> },
    { value: 'system', label: 'System', icon: <HiOutlineComputerDesktop /> },
  ]

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">CV</div>
          <span className="brand-text">CivicVoice</span>
        </Link>

        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <NavLink to="/track">Track</NavLink>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : isAdmin ? (
            <>
              <NavLink to="/admin">Dashboard</NavLink>
              <NavLink to="/admin/complaints">Complaints</NavLink>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/submit">File Complaint</NavLink>
              <NavLink to="/track">Track</NavLink>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          )}

          {/* Theme Toggle */}
          <div className="theme-toggle" ref={themeRef}>
            <button
              className="theme-toggle-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              aria-label="Toggle theme"
              id="theme-toggle-btn"
            >
              {themeIcon}
            </button>
            {showThemeMenu && (
              <div className="theme-dropdown" id="theme-dropdown">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={mode === opt.value ? 'active' : ''}
                    onClick={() => { setMode(opt.value); setShowThemeMenu(false) }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="theme-toggle" ref={null} style={{ display: 'none' }}>
            {/* Theme toggle is already in navbar-links for desktop, separate for mobile below */}
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-btn"
          >
            {mobileOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobile-nav">
        {!isAuthenticated ? (
          <>
            <Link to="/track" onClick={() => setMobileOpen(false)}>Track Complaint</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
          </>
        ) : isAdmin ? (
          <>
            <Link to="/admin" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link to="/admin/complaints" onClick={() => setMobileOpen(false)}>All Complaints</Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>My Dashboard</Link>
            <Link to="/submit" onClick={() => setMobileOpen(false)}>File Complaint</Link>
            <Link to="/track" onClick={() => setMobileOpen(false)}>Track Complaint</Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        )}

        {/* Mobile Theme Options */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 16px', marginBottom: '8px' }}>Theme</p>
          {themeOptions.map(opt => (
            <button
              key={opt.value}
              className={mode === opt.value ? 'active' : ''}
              onClick={() => { setMode(opt.value) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: mode === opt.value ? 'var(--primary-light)' : 'none',
                color: mode === opt.value ? 'var(--primary)' : undefined,
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
