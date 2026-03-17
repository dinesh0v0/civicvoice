import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  HiOutlineHome,
  HiOutlineDocumentPlus,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBarSquare,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth()
  const location = useLocation()

  const citizenLinks = [
    { to: '/dashboard', label: 'My Dashboard', icon: <HiOutlineHome /> },
    { to: '/submit', label: 'File Complaint', icon: <HiOutlineDocumentPlus /> },
    { to: '/track', label: 'Track Complaint', icon: <HiOutlineMagnifyingGlass /> },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <HiOutlineChartBarSquare /> },
    { to: '/admin/complaints', label: 'All Complaints', icon: <HiOutlineClipboardDocumentList /> },
  ]

  const links = isAdmin ? adminLinks : citizenLinks

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`} id="app-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            {isAdmin ? 'Administration' : 'Navigation'}
          </div>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
              end={link.to === '/admin' || link.to === '/dashboard'}
            >
              <span className="icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Account</div>
          <NavLink to="/profile" className="sidebar-link" onClick={onClose}>
            <span className="icon"><HiOutlineUserCircle /></span>
            Profile
          </NavLink>
          <NavLink to="/settings" className="sidebar-link" onClick={onClose}>
            <span className="icon"><HiOutlineCog6Tooth /></span>
            Settings
          </NavLink>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />
    </>
  )
}
