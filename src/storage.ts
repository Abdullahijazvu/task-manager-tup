import type { Activity, Task, Workspace } from './types'

const keys = {
  tasks: 'task-manager-tasks',
  workspaces: 'task-manager-workspaces',
  activities: 'task-manager-activities',
}

export function loadData() {
  try {
    const tasks = JSON.parse(localStorage.getItem(keys.tasks) || 'null') as Task[] | null
    const workspaces = JSON.parse(localStorage.getItem(keys.workspaces) || 'null') as Workspace[] | null
    const activities = JSON.parse(localStorage.getItem(keys.activities) || 'null') as Activity[] | null

    return { tasks, workspaces, activities }
  } catch {
    return { tasks: null, workspaces: null, activities: null }
  }
}

export function saveData(tasks: Task[], workspaces: Workspace[], activities: Activity[]) {
  localStorage.setItem(keys.tasks, JSON.stringify(tasks))
  localStorage.setItem(keys.workspaces, JSON.stringify(workspaces))
  localStorage.setItem(keys.activities, JSON.stringify(activities))
}
