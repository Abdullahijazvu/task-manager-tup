import type { TaskFormValues } from './types'

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function validateTask(values: TaskFormValues) {
  const errors: Partial<Record<keyof TaskFormValues, string>> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.description.trim()) errors.description = 'Description is required.'
  if (!values.dueDate) errors.dueDate = 'Due date is required.'
  else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(`${values.dueDate}T00:00:00`)
    if (due < today) errors.dueDate = 'Due date cannot be in the past.'
  }
  return errors
}

export function relativeTime(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
