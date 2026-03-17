import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { HiOutlineUserCircle } from 'react-icons/hi2'

export default function Profile() {
  const { profile, user, signOut } = useAuth()

  return (
    <div className="page-container" id="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your account information</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', flexShrink: 0
          }}>
            <HiOutlineUserCircle />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '2px' }}>{profile?.full_name || 'User'}</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {profile?.role === 'admin' ? '🛡️ Administrator' : '👤 Citizen'}
            </p>
          </div>
        </div>

        <dl>
          <div className="detail-info-row">
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div className="detail-info-row">
            <dt>Phone</dt>
            <dd>{profile?.phone || 'Not provided'}</dd>
          </div>
          <div className="detail-info-row">
            <dt>Role</dt>
            <dd style={{ textTransform: 'capitalize' }}>{profile?.role || 'citizen'}</dd>
          </div>
          <div className="detail-info-row">
            <dt>Member Since</dt>
            <dd>{new Date(profile?.created_at || user?.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}</dd>
          </div>
        </dl>

        <button
          className="btn btn-danger"
          style={{ marginTop: '28px' }}
          onClick={() => {
            signOut()
            toast.success('Signed out')
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
