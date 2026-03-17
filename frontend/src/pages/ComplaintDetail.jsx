import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import { HiOutlineArrowLeft } from 'react-icons/hi2'

export default function ComplaintDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplaint()
  }, [id])

  async function fetchComplaint() {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setComplaint(data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-container"><div className="spinner" /></div>

  if (!complaint) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Complaint Not Found</h3>
          <p>The complaint you're looking for doesn't exist or you don't have access.</p>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const statusSteps = ['pending', 'in_review', 'investigating', 'resolved']
  const currentStep = statusSteps.indexOf(complaint.status)

  return (
    <div className="page-container" id="complaint-detail-page">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        <HiOutlineArrowLeft /> Back to Dashboard
      </Link>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: "'Outfit', monospace", fontWeight: 700, fontSize: '14px', color: 'var(--primary)', marginBottom: '4px' }}>
            {complaint.tracking_id}
          </p>
          <h1>{complaint.subject}</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="detail-grid">
        {/* Main Content */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-tertiary)' }}>Complaint Details</h3>
            <dl>
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

          {complaint.admin_remarks && (
            <div className="card" style={{ marginTop: '20px', borderLeft: '3px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text-tertiary)' }}>Admin Remarks</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{complaint.admin_remarks}</p>
            </div>
          )}
        </div>

        {/* Sidebar - Timeline */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-tertiary)' }}>Status Timeline</h3>
            <div className="timeline">
              {statusSteps.map((step, i) => {
                const isActive = complaint.status === 'rejected' ? false : i <= currentStep
                return (
                  <div className="timeline-item" key={step}>
                    <div className={`timeline-dot ${isActive ? '' : 'inactive'}`} />
                    <h4 style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                      {step.replace(/_/g, ' ')}
                    </h4>
                    <p>
                      {isActive && i === currentStep ? 'Current' :
                        isActive ? 'Completed' : 'Upcoming'}
                    </p>
                  </div>
                )
              })}
              {complaint.status === 'rejected' && (
                <div className="timeline-item">
                  <div className="timeline-dot" style={{ background: 'var(--status-rejected)', boxShadow: '0 0 0 2px var(--status-rejected)' }} />
                  <h4 style={{ color: 'var(--status-rejected)' }}>Rejected</h4>
                  <p>Current</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
