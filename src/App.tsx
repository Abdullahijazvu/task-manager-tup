import { useMemo, useState } from 'react'
import ActivityPanel from './components/ActivityPanel'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import { defaultActivities, defaultTasks, defaultWorkspaces } from './data'
import { loadData, saveData } from './storage'
import type { Activity, Priority, Status, Task, TaskFormValues, Workspace } from './types'
import { createId } from './utils'

const stored = loadData()
const initialWorkspaces = stored.workspaces?.length ? stored.workspaces : defaultWorkspaces
const initialTasks = stored.tasks ?? defaultTasks
const initialActivities = stored.activities ?? defaultActivities

export default function App() {
  const [workspaces] = useState<Workspace[]>(initialWorkspaces)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [selectedWorkspace, setSelectedWorkspace] = useState(initialWorkspaces[0].id)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All')
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All')
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function persist(nextTasks: Task[], nextActivities: Activity[]) {
    saveData(nextTasks, workspaces, nextActivities)
  }

  function addActivity(message: string) {
    const next = [{ id: createId('activity'), message, createdAt: new Date().toISOString() }, ...activities].slice(0, 30)
    setActivities(next)
    return next
  }

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function saveTask(values: TaskFormValues) {
    let nextTasks: Task[]
    let nextActivities: Activity[]

    if (editingTask) {
      nextTasks = tasks.map(task => task.id === editingTask.id ? { ...task, ...values, updatedAt: new Date().toISOString() } : task)
      nextActivities = addActivity(`Task "${values.title}" updated`)
    } else {
      const task: Task = { id: createId('task'), workspaceId: selectedWorkspace, ...values, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      nextTasks = [task, ...tasks]
      nextActivities = addActivity(`Task "${values.title}" created`)
    }

    setTasks(nextTasks)
    persist(nextTasks, nextActivities)
    setModalOpen(false)
  }

  function deleteTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    const nextTasks = tasks.filter(item => item.id !== task.id)
    const nextActivities = addActivity(`Task "${task.title}" deleted`)
    setTasks(nextTasks)
    persist(nextTasks, nextActivities)
  }

  function changeStatus(task: Task, status: Status) {
    if (task.status === status) return
    const nextTasks = tasks.map(item => item.id === task.id ? { ...item, status, updatedAt: new Date().toISOString() } : item)
    const nextActivities = addActivity(`Task "${task.title}" marked as ${status}`)
    setTasks(nextTasks)
    persist(nextTasks, nextActivities)
  }

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase()
    return tasks
      .filter(task => task.workspaceId === selectedWorkspace)
      .filter(task => !term || task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term))
      .filter(task => statusFilter === 'All' || task.status === statusFilter)
      .filter(task => priorityFilter === 'All' || task.priority === priorityFilter)
      .sort((a, b) => {
        const comparison = a.dueDate.localeCompare(b.dueDate)
        return sortOrder === 'oldest' ? comparison : -comparison
      })
  }, [tasks, selectedWorkspace, search, statusFilter, priorityFilter, sortOrder])

  const selectedName = workspaces.find(workspace => workspace.id === selectedWorkspace)?.name || ''

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <button className="menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
        <strong>TaskFlow</strong>
      </header>
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark">T</span><span>TaskFlow</span></div>
        <div className="sidebar-section">
          <span className="sidebar-label">Workspaces</span>
          {workspaces.map(workspace => (
            <button key={workspace.id} className={`workspace-button ${selectedWorkspace === workspace.id ? 'active' : ''}`} onClick={() => { setSelectedWorkspace(workspace.id); setMobileMenuOpen(false) }}>
              <span className="workspace-dot" />{workspace.name}
            </button>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div><span className="eyebrow">Workspace</span><h1>{selectedName}</h1></div>
          <button className="button primary" onClick={openCreate}>+ New task</button>
        </div>

        <section className="controls">
          <div className="search-wrap"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'All' | Status)} aria-label="Filter by status">
            <option value="All">All statuses</option><option>To Do</option><option>In Progress</option><option>Done</option>
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as 'All' | Priority)} aria-label="Filter by priority">
            <option value="All">All priorities</option><option>Low</option><option>Medium</option><option>High</option>
          </select>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'oldest' | 'newest')} aria-label="Sort by due date">
            <option value="oldest">Due date: oldest</option><option value="newest">Due date: newest</option>
          </select>
        </section>

        <div className="task-summary"><span>{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}</span>{search || statusFilter !== 'All' || priorityFilter !== 'All' ? <button onClick={() => { setSearch(''); setStatusFilter('All'); setPriorityFilter('All') }}>Clear filters</button> : null}</div>

        <section className="task-grid">
          {filteredTasks.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">✓</div><h2>No tasks found</h2><p>Try changing your filters or create a new task.</p><button className="button primary" onClick={openCreate}>Create task</button></div>
          ) : filteredTasks.map(task => <TaskCard key={task.id} task={task} onEdit={() => openEdit(task)} onDelete={() => deleteTask(task)} onStatusChange={status => changeStatus(task, status)} />)}
        </section>
      </main>

      <ActivityPanel activities={activities} />
      {modalOpen && <TaskForm task={editingTask} onSave={saveTask} onClose={() => setModalOpen(false)} />}
    </div>
  )
}
