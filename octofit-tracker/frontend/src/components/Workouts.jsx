import { useEffect, useState } from 'react'

const getApiUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/'
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(getApiUrl())
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        const payload = Array.isArray(data) ? data : data.workouts ?? data.results ?? []
        setWorkouts(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load workouts')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  return (
    <div className="card shadow-sm rounded-4">
      <div className="card-header px-4 py-3 rounded-top-4">
        <h2 className="h4 mb-0">Workouts</h2>
      </div>
      <div className="card-body p-4">
        {loading && <p className="text-muted mb-0">Loading workouts...</p>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length > 0 ? (
                  workouts.map((workout, index) => (
                    <tr key={workout.id ?? workout._id ?? `${workout.name ?? 'workout'}-${index}`}>
                      <td>{workout.name ?? '—'}</td>
                      <td>{workout.type ?? '—'}</td>
                      <td>{workout.duration ?? workout.durationMinutes ?? '—'}</td>
                      <td>{workout.difficulty ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-muted text-center">
                      No workouts found.
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

export default Workouts
