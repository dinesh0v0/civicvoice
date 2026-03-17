const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(endpoint, options = {}) {
  const { method = 'GET', body, token } = options

  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = { method, headers }
  if (body) {
    config.body = JSON.stringify(body)
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Something went wrong')
  }

  return data
}

export const api = {
  // Auth
  getProfile: (token) => request('/api/auth/profile', { token }),

  // Complaints (citizen)
  submitComplaint: (data, token) =>
    request('/api/complaints', { method: 'POST', body: data, token }),
  getMyComplaints: (token) =>
    request('/api/complaints', { token }),
  getComplaint: (id, token) =>
    request(`/api/complaints/${id}`, { token }),
  trackComplaint: (trackingId) =>
    request(`/api/complaints/track/${trackingId}`),

  // Admin
  getAdminStats: (token) =>
    request('/api/admin/stats', { token }),
  getAdminComplaints: (token, params = '') =>
    request(`/api/admin/complaints${params}`, { token }),
  updateComplaint: (id, data, token) =>
    request(`/api/admin/complaints/${id}`, { method: 'PATCH', body: data, token }),
}
