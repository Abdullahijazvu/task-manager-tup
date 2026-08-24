import type { Task } from '../types'
import { formatDate } from '../utils'

type Props = {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: Task['status']) => void
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <div className="task-badges">
          <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span className={`badge status-${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span>
        </div>
        <div className="card-actions">
          <button className="card-action-btn edit-btn" onClick={onEdit} aria-label="Edit task" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button className="card-action-btn delete-btn" onClick={onDelete} aria-label="Delete task" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-footer">
        <span>Due {formatDate(task.dueDate)}</span>
        <select value={task.status} onChange={e => onStatusChange(e.target.value as Task['status'])} aria-label={`Change status for ${task.title}`}>
          <option>To Do</option><option>In Progress</option><option>Done</option>
        </select>
      </div>
    </article>
  )
}
