export default function StatusBadge({ status }) {
  const label = (status || 'pending').replace(/_/g, ' ')
  return (
    <span className={`status-badge ${status || 'pending'}`}>
      <span className="status-dot" />
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge ${priority || 'medium'}`}>
      {priority || 'medium'}
    </span>
  )
}
