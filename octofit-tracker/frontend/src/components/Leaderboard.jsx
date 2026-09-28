import { useEffect, useState } from 'react'

const getApiUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/'
}

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(getApiUrl())
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        const payload = Array.isArray(data) ? data : data.leaderboard ?? data.results ?? []
        setEntries(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="card shadow-sm rounded-4">
      <div className="card-header px-4 py-3 rounded-top-4">
        <h2 className="h4 mb-0">Leaderboard</h2>
      </div>
      <div className="card-body p-4">
        {loading && <p className="text-muted mb-0">Loading leaderboard...</p>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.length > 0 ? (
                  entries.map((entry, index) => (
                    <tr key={entry.id ?? entry._id ?? `${entry.name ?? 'entry'}-${index}`}>
                      <td>{entry.rank ?? index + 1}</td>
                      <td>{entry.name ?? entry.username ?? '—'}</td>
                      <td>{entry.score ?? entry.points ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-muted text-center">
                      No leaderboard entries found.
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

export default Leaderboard
