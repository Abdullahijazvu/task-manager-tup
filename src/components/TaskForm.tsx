import { useEffect, useState } from 'react'
import type { Priority, Status, Task, TaskFormValues } from '../types'
import { validateTask } from '../utils'

type Props = {
  task?: Task | null
  onSave: (values: TaskFormValues) => void
  onClose: () => void
}

const empty: TaskFormValues = { title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '' }

export default function TaskForm({ task, onSave, onClose }: Props) {
  const [values, setValues] = useState<TaskFormValues>(empty)
  const [errors, setErrors] = useState<ReturnType<typeof validateTask>>({})

  useEffect(() => {
    setValues(task ? {
      title: task.title, description: task.description, priority: task.priority,
      status: task.status, dueDate: task.dueDate,
    } : empty)
    setErrors({})
  }, [task])

  function update<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: undefined }))
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors = validateTask(values)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSave({ ...values, title: values.title.trim(), description: values.description.trim() })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={event => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Task</span>
            <h2>{task ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>

        <label>Title *
          <input autoFocus value={values.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Finish homepage design" />
          {errors.title && <small className="error">{errors.title}</small>}
        </label>

        <label>Description *
          <textarea rows={4} value={values.description} onChange={e => update('description', e.target.value)} placeholder="Add a short description..." />
          {errors.description && <small className="error">{errors.description}</small>}
        </label>

        <div className="form-grid">
          <label>Priority
            <select value={values.priority} onChange={e => update('priority', e.target.value as Priority)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
          <label>Status
            <select value={values.status} onChange={e => update('status', e.target.value as Status)}>
              <option>To Do</option><option>In Progress</option><option>Done</option>
            </select>
          </label>
        </div>

        <label>Due date *
          <input type="date" min={new Date().toISOString().slice(0, 10)} value={values.dueDate} onChange={e => update('dueDate', e.target.value)} />
          {errors.dueDate && <small className="error">{errors.dueDate}</small>}
        </label>

        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="button primary">{task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  )
}
