import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import { HiOutlineMagnifyingGlass, HiOutlineInboxStack } from 'react-icons/hi2'

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter, categoryFilter, search])

  async function fetchComplaints() {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, profiles(full_name, phone)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setComplaints(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function filterComplaints() {
    let result = [...complaints]
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter)
    }
    if (categoryFilter !== 'all') {
      result = result.filter(c => c.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.tracking_id?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.profiles?.full_name?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }

  const categories = [...new Set(complaints.map(c => c.category))].sort()

  if (loading) return <div className="page-container"><div className="spinner" /></div>

  return (
    <div className="page-container" id="admin-complaints-page">
      <div className="page-header">
        <h1>All Complaints</h1>
        <p>{complaints.length} total complaints in the system</p>
      </div>

      {/* Filters */}
      <div className="toolbar">
        <div className="toolbar-filters">
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} id="filter-status">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} id="filter-category">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="search-input-wrapper">
          <HiOutlineMagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, subject, or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="search-complaints"
          />
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
        Showing {filtered.length} of {complaints.length} complaints
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><HiOutlineInboxStack /></div>
          <h3>No complaints found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          {/* Table for desktop */}
          <div className="table-container" style={{ display: 'block' }}>
            <table className="data-table" id="admin-complaints-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Subject</th>
                  <th>Filed By</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: "'Outfit', monospace", fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                      {c.tracking_id}
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.subject}
                    </td>
                    <td>{c.profiles?.full_name || 'Unknown'}</td>
                    <td>{c.category}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <Link to={`/admin/complaint/${c.id}`} className="btn btn-secondary btn-sm">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
