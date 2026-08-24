import type { Activity, Task, Workspace } from './types'

const now = new Date().toISOString()
const future = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export const defaultWorkspaces: Workspace[] = [
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
]

export const defaultTasks: Task[] = [
  {
    id: 'task-1', workspaceId: 'work', title: 'Prepare project proposal',
    description: 'Finish the proposal and send it to the client for review.',
    priority: 'High', status: 'In Progress', dueDate: future(3), createdAt: now, updatedAt: now,
  },
  {
    id: 'task-2', workspaceId: 'work', title: 'Update website content',
    description: 'Review the homepage copy and update the service descriptions.',
    priority: 'Medium', status: 'To Do', dueDate: future(7), createdAt: now, updatedAt: now,
  },
  {
    id: 'task-3', workspaceId: 'personal', title: 'Buy groceries',
    description: 'Pick up vegetables, milk, bread and coffee.',
    priority: 'Low', status: 'Done', dueDate: future(1), createdAt: now, updatedAt: now,
  },
]

export const defaultActivities: Activity[] = [
  { id: 'activity-1', message: 'Task "Buy groceries" marked as Done', createdAt: now },
  { id: 'activity-2', message: 'Task "Update website content" created', createdAt: now },
]
