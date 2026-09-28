import { useEffect, useState } from 'react'

const getApiUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/'
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(getApiUrl())
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        const payload = Array.isArray(data) ? data : data.activities ?? data.results ?? []
        setActivities(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return (
    <div className="card shadow-sm rounded-4">
      <div className="card-header px-4 py-3 rounded-top-4">
        <h2 className="h4 mb-0">Activities</h2>
      </div>
      <div className="card-body p-4">
        {loading && <p className="text-muted mb-0">Loading activities...</p>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <tr key={activity.id ?? activity._id ?? `${activity.type}-${activity.date}`}>
                      <td>{activity.id ?? activity._id ?? '—'}</td>
                      <td>{activity.type ?? '—'}</td>
                      <td>{activity.durationMinutes ?? activity.duration ?? '—'} min</td>
                      <td>{activity.userId ?? activity.user ?? '—'}</td>
                      <td>{activity.date ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted text-center">
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Activities
