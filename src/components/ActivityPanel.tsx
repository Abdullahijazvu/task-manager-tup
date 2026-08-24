import type { Activity } from '../types'
import { relativeTime } from '../utils'

type Props = { activities: Activity[] }

export default function ActivityPanel({ activities }: Props) {
  return (
    <aside className="activity-panel">
      <div className="section-heading">
        <div><span className="eyebrow">History</span><h2>Recent activity</h2></div>
      </div>
      <div className="activity-list">
        {activities.length === 0 ? <p className="muted">No activity yet.</p> : activities.slice(0, 5).map(activity => (
          <div className="activity-item" key={activity.id}>
            <span className="activity-dot" />
            <div><p>{activity.message}</p><small>{relativeTime(activity.createdAt)}</small></div>
          </div>
        ))}
      </div>
    </aside>
  )
}
