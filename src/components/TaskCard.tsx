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
        <div className="task-menu">
          <button className="more-button" aria-label="Task actions">•••</button>
          <div className="task-actions">
            <button onClick={onEdit}>Edit</button>
            <button className="danger-text" onClick={onDelete}>Delete</button>
          </div>
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
