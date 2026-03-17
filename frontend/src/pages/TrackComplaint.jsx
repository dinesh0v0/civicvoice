import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StatusBadge, { PriorityBadge } from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

export default function TrackComplaint() {
  const [trackingId, setTrackingId] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID')
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('tracking_id', trackingId.trim().toUpperCase())
        .single()

      if (error || !data) {
        setComplaint(null)
        toast.error('No complaint found with this tracking ID')
      } else {
        setComplaint(data)
      }
    } catch (err) {
      setComplaint(null)
      toast.error('No complaint found with this tracking ID')
    } finally {
      setLoading(false)
    }
  }

  const statusSteps = ['pending', 'in_review', 'investigating', 'resolved']
  const currentStep = complaint ? statusSteps.indexOf(complaint.status) : -1

  return (
    <div className="page-container" id="track-page">
      <div className="track-container">
        <div className="track-card card">
          <div className="track-icon">
            <HiOutlineMagnifyingGlass />
          </div>
          <h1>Track Your Complaint</h1>
          <p>Enter your tracking ID to check the current status of your complaint.</p>

          <form className="track-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CMP-2026-12345"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              id="track-input"
              style={{ textTransform: 'uppercase' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="track-search-btn"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Results */}
          {searched && !loading && complaint && (
            <div style={{ marginTop: '32px', textAlign: 'left' }} className="animate-fade-in-up">
              <div style={{
                padding: '20px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{
                    fontFamily: "'Outfit', monospace", fontWeight: 700, fontSize: '16px', color: 'var(--primary)'
                  }}>{complaint.tracking_id}</span>
                  <StatusBadge status={complaint.status} />
                </div>

                <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>{complaint.subject}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {complaint.category} • {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>

                {/* Status Timeline */}
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-tertiary)' }}>Progress</h4>
                  <div className="timeline">
                    {statusSteps.map((step, i) => {
                      const isActive = complaint.status === 'rejected' ? false : i <= currentStep
                      return (
                        <div className="timeline-item" key={step}>
                          <div className={`timeline-dot ${isActive ? '' : 'inactive'}`} />
                          <h4 style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                            {step.replace(/_/g, ' ')}
                          </h4>
                          <p>{isActive && i === currentStep ? 'Current status' : ''}</p>
                        </div>
                      )
                    })}
                    {complaint.status === 'rejected' && (
                      <div className="timeline-item">
                        <div className="timeline-dot" style={{ background: 'var(--status-rejected)', boxShadow: '0 0 0 2px var(--status-rejected)' }} />
                        <h4 style={{ color: 'var(--status-rejected)' }}>Rejected</h4>
                        <p>Current status</p>
                      </div>
                    )}
                  </div>
                </div>

                {complaint.admin_remarks && (
                  <div style={{
                    marginTop: '20px', padding: '14px', background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)'
                  }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Admin Remarks</h4>
                    <p style={{ fontSize: '14px' }}>{complaint.admin_remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {searched && !loading && !complaint && (
            <div style={{ marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              No complaint found. Please check the tracking ID and try again.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
