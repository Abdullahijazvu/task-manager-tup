export type Priority = 'Low' | 'Medium' | 'High'
export type Status = 'To Do' | 'In Progress' | 'Done'

export type Workspace = {
  id: string
  name: string
}

export type Task = {
  id: string
  workspaceId: string
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: string
  createdAt: string
  updatedAt: string
}

export type Activity = {
  id: string
  message: string
  createdAt: string
}

export type TaskFormValues = Omit<Task, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>
