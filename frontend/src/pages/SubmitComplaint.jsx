import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'
import { HiOutlineDocumentPlus } from 'react-icons/hi2'

const CATEGORIES = [
  'Theft', 'Robbery', 'Fraud', 'Cybercrime', 'Assault',
  'Harassment', 'Domestic Violence', 'Missing Person',
  'Traffic Violation', 'Noise Complaint', 'Property Dispute', 'Other'
]

function generateTrackingId() {
  const year = new Date().getFullYear()
  const num = Math.floor(10000 + Math.random() * 90000)
  return `CMP-${year}-${num}`
}

export default function SubmitComplaint() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category: '',
    subject: '',
    description: '',
    location: '',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category || !form.subject || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const trackingId = generateTrackingId()
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          tracking_id: trackingId,
          category: form.category,
          subject: form.subject,
          description: form.description,
          location: form.location,
          status: 'pending',
          priority: 'medium',
        })
        .select()
        .single()

      if (error) throw error

      toast.success(
        `Complaint filed! Tracking ID: ${trackingId}`,
        { duration: 6000 }
      )
      navigate(`/complaint/${data.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container" id="submit-complaint-page">
      <div className="page-header">
        <h1><HiOutlineDocumentPlus style={{ verticalAlign: 'middle' }} /> File a Complaint</h1>
        <p>Provide the details of your complaint below. All fields marked with * are required.</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="complaint-category">Category *</label>
            <select
              id="complaint-category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="complaint-subject">Subject *</label>
            <input
              id="complaint-subject"
              name="subject"
              type="text"
              className="form-input"
              placeholder="Brief title of your complaint"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="complaint-description">Description *</label>
            <textarea
              id="complaint-description"
              name="description"
              className="form-textarea"
              placeholder="Provide a detailed description of the incident, including date, time, and any relevant information..."
              value={form.description}
              onChange={handleChange}
              required
              rows={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="complaint-location">Location</label>
            <input
              id="complaint-location"
              name="location"
              type="text"
              className="form-input"
              placeholder="Where did the incident occur?"
              value={form.location}
              onChange={handleChange}
            />
            <p className="form-hint">Include city, area, or address if possible</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              id="submit-complaint-btn"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
