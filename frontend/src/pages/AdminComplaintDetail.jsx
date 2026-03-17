import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { HiOutlineArrowLeft } from 'react-icons/hi2'

export default function AdminComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ status: '', priority: '', admin_remarks: '' })

  useEffect(() => {
    fetchComplaint()
  }, [id])

  async function fetchComplaint() {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, profiles(full_name, phone)')
        .eq('id', id)
        .single()

      if (error) throw error
      setComplaint(data)
      setForm({
        status: data.status,
        priority: data.priority,
        admin_remarks: data.admin_remarks || '',
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          status: form.status,
          priority: form.priority,
          admin_remarks: form.admin_remarks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Complaint updated successfully')
      fetchComplaint()
    } catch (err) {
      toast.error(err.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-container"><div className="spinner" /></div>

  if (!complaint) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Complaint Not Found</h3>
          <Link to="/admin/complaints" className="btn btn-primary">Back to Complaints</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" id="admin-complaint-detail">
      <Link to="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        <HiOutlineArrowLeft /> Back to All Complaints
      </Link>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: "'Outfit', monospace", fontWeight: 700, fontSize: '14px', color: 'var(--primary)', marginBottom: '4px' }}>
            {complaint.tracking_id}
          </p>
          <h1>{complaint.subject}</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="detail-grid">
        {/* Left: Complaint Info */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-tertiary)' }}>Complaint Information</h3>
            <dl>
              <div className="detail-info-row">
                <dt>Filed By</dt>
                <dd>{complaint.profiles?.full_name || 'Unknown'}</dd>
              </div>
              <div className="detail-info-row">
                <dt>Phone</dt>
                <dd>{complaint.profiles?.phone || 'Not provided'}</dd>
              </div>
              <div className="detail-info-row">
                <dt>Category</dt>
                <dd>{complaint.category}</dd>
              </div>
              <div className="detail-info-row">
                <dt>Location</dt>
                <dd>{complaint.location || 'Not provided'}</dd>
              </div>
              <div className="detail-info-row">
                <dt>Filed On</dt>
                <dd>{new Date(complaint.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</dd>
              </div>
              <div className="detail-info-row">
                <dt>Last Updated</dt>
                <dd>{new Date(complaint.updated_at || complaint.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-tertiary)' }}>Description</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Right: Admin Actions */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-tertiary)' }}>Manage Complaint</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-status">Status</label>
                <select
                  id="admin-status"
                  className="form-select"
                  value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                >
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-priority">Priority</label>
                <select
                  id="admin-priority"
                  className="form-select"
                  value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-remarks">Admin Remarks</label>
                <textarea
                  id="admin-remarks"
                  className="form-textarea"
                  placeholder="Add notes, updates, or instructions for the citizen..."
                  value={form.admin_remarks}
                  onChange={e => setForm(p => ({ ...p, admin_remarks: e.target.value }))}
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={saving}
                id="admin-update-btn"
              >
                {saving ? 'Updating...' : 'Update Complaint'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
