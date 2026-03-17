import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'

export default function Settings() {
  const { profile } = useAuth()
  const { theme, setTheme } = useTheme()
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true
  })

  const handleSave = (e) => {
    e.preventDefault()
    // In a real app, this would save to the database
    toast.success('Settings saved successfully')
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and application settings.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Appearance
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTheme('light')}
            >
              Light Mode
            </button>
            <button
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTheme('dark')}
            >
              Dark Mode
            </button>
            <button
              className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTheme('system')}
            >
              System Default
            </button>
          </div>

          <form onSubmit={handleSave}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Notifications
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                Receive email updates about my complaints
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                Receive SMS alerts for priority changes
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.app}
                  onChange={(e) => setNotifications({ ...notifications, app: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                In-app notifications
              </label>
            </div>

            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Account Security
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <button type="button" className="btn btn-outline" style={{ marginBottom: '1rem', display: 'block' }}>
                Change Password
              </button>
              <button type="button" className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                Delete Account
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
