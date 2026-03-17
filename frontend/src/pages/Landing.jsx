import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  HiOutlineDocumentPlus,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineBell,
} from 'react-icons/hi2'

export default function Landing() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="hero-section" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <HiOutlineShieldCheck />
            Demo Community Project — Not a Government Site
          </div>
          <h1>
            Your Voice Matters.{' '}
            <span className="gradient-text">Report. Track. Resolve.</span>
          </h1>
          <p>
            CivicVoice is a modern online complaint management platform connecting
            citizens with police. File complaints easily, track them in real-time,
            and stay informed every step of the way.
          </p>
          <div className="hero-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta-register">
                  File a Complaint
                </Link>
                <Link to="/track" className="btn btn-outline btn-lg" id="hero-cta-track">
                  Track Your Complaint
                </Link>
              </>
            ) : isAdmin ? (
              <Link to="/admin" className="btn btn-primary btn-lg">
                Go to Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/submit" className="btn btn-primary btn-lg">
                  File a Complaint
                </Link>
                <Link to="/dashboard" className="btn btn-outline btn-lg">
                  My Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner" id="stats-banner">
        {[
          { value: '10,000+', label: 'Complaints Filed' },
          { value: '95%', label: 'Resolution Rate' },
          { value: '24/7', label: 'Support Available' },
          { value: '500+', label: 'Officers Active' },
        ].map((stat, i) => (
          <div className="stat-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section" id="features-section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          A simple, transparent process to ensure your complaint is heard and acted upon.
        </p>
        <div className="features-grid">
          {[
            {
              icon: <HiOutlineDocumentPlus />,
              title: 'Submit Your Complaint',
              desc: 'Fill out a simple form with all the details. Choose a category, describe the incident, and submit in minutes.',
            },
            {
              icon: <HiOutlineMagnifyingGlass />,
              title: 'Track in Real-Time',
              desc: 'Get a unique tracking ID for every complaint. Check the status anytime — from pending to resolved.',
            },
            {
              icon: <HiOutlineBell />,
              title: 'Stay Notified',
              desc: 'Receive updates as your complaint moves through the system. Full transparency at every step.',
            },
            {
              icon: <HiOutlineShieldCheck />,
              title: 'Police Admin Panel',
              desc: 'Authorized officers review, investigate, and resolve complaints through a powerful admin dashboard.',
            },
            {
              icon: <HiOutlineChartBar />,
              title: 'Analytics & Insights',
              desc: 'Administrators can monitor complaint trends, response times, and resolution rates with built-in analytics.',
            },
            {
              icon: <HiOutlineClock />,
              title: 'Fast Resolution',
              desc: 'Priority-based handling ensures urgent complaints get immediate attention. No complaint goes unnoticed.',
            },
          ].map((feat, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="app-footer">
        <div className="footer-brand">CivicVoice</div>
        <p>Online Complaint Management System</p>
        <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          © {new Date().getFullYear()} CivicVoice. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
