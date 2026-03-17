import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StatusBadge from '../components/StatusBadge'
import {
  HiOutlineInboxStack,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
} from 'react-icons/hi2'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, in_review: 0, investigating: 0, resolved: 0, rejected: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const all = data || []
      setStats({
        total: all.length,
        pending: all.filter(c => c.status === 'pending').length,
        in_review: all.filter(c => c.status === 'in_review').length,
        investigating: all.filter(c => c.status === 'investigating').length,
        resolved: all.filter(c => c.status === 'resolved').length,
        rejected: all.filter(c => c.status === 'rejected').length,
      })
      setRecent(all.slice(0, 8))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-container"><div className="spinner" /></div>

  return (
    <div className="page-container" id="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of all complaints and their current status.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineInboxStack /></div>
          <div className="stat-info"><h3>{stats.total}</h3><p>Total Complaints</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><HiOutlineClock /></div>
          <div className="stat-info"><h3>{stats.pending}</h3><p>Pending</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineExclamationTriangle /></div>
          <div className="stat-info"><h3>{stats.in_review}</h3><p>In Review</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><HiOutlineExclamationTriangle /></div>
          <div className="stat-info"><h3>{stats.investigating}</h3><p>Investigating</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div className="stat-info"><h3>{stats.resolved}</h3><p>Resolved</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><HiOutlineXCircle /></div>
          <div className="stat-info"><h3>{stats.rejected}</h3><p>Rejected</p></div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px' }}>Recent Complaints</h2>
        <Link to="/admin/complaints" className="btn btn-secondary btn-sm">View All</Link>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><HiOutlineInboxStack /></div>
          <h3>No complaints yet</h3>
          <p>Complaints will appear here as citizens submit them.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" id="admin-recent-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: "'Outfit', monospace", fontWeight: 600, color: 'var(--primary)' }}>
                    {c.tracking_id}
                  </td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.subject}
                  </td>
                  <td>{c.category}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td>
                    <Link to={`/admin/complaint/${c.id}`} className="btn btn-secondary btn-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
