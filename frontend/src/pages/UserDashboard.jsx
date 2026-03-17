import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import StatusBadge from '../components/StatusBadge'
import {
  HiOutlineDocumentPlus,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineInboxStack,
} from 'react-icons/hi2'

export default function UserDashboard() {
  const { user, profile } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, investigating: 0 })

  useEffect(() => {
    fetchComplaints()
  }, [user])

  async function fetchComplaints() {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComplaints(data || [])

      // Calculate stats
      const total = data?.length || 0
      const pending = data?.filter(c => c.status === 'pending').length || 0
      const resolved = data?.filter(c => c.status === 'resolved').length || 0
      const investigating = data?.filter(c => ['investigating', 'in_review'].includes(c.status)).length || 0
      setStats({ total, pending, resolved, investigating })
    } catch (err) {
      console.error('Error fetching complaints:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-container"><div className="spinner" /></div>

  return (
    <div className="page-container" id="user-dashboard">
      <div className="page-header">
        <h1>Welcome, {profile?.full_name || 'User'} 👋</h1>
        <p>Here's an overview of your complaints and their status.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineInboxStack /></div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><HiOutlineClock /></div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineExclamationTriangle /></div>
          <div className="stat-info">
            <h3>{stats.investigating}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div className="stat-info">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link to="/submit" className="btn btn-primary" id="btn-new-complaint">
          <HiOutlineDocumentPlus /> File New Complaint
        </Link>
        <Link to="/track" className="btn btn-secondary">
          Track by ID
        </Link>
      </div>

      {/* Recent Complaints */}
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>My Complaints</h2>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><HiOutlineInboxStack /></div>
          <h3>No complaints yet</h3>
          <p>You haven't filed any complaints. Click the button above to get started.</p>
          <Link to="/submit" className="btn btn-primary">File Your First Complaint</Link>
        </div>
      ) : (
        <div className="complaint-cards">
          {complaints.map(c => (
            <Link
              to={`/complaint/${c.id}`}
              key={c.id}
              className="complaint-card"
              id={`complaint-${c.id}`}
            >
              <div className="complaint-card-header">
                <span className="tracking-id">{c.tracking_id}</span>
                <StatusBadge status={c.status} />
              </div>
              <h4>{c.subject}</h4>
              <div className="complaint-meta">
                <span>{c.category}</span>
                <span>•</span>
                <span>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {c.location && <><span>•</span><span>{c.location}</span></>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
