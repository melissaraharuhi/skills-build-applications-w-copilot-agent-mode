import { useEffect, useState } from 'react'

const getApiUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/'
}

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(getApiUrl())
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        const payload = Array.isArray(data) ? data : data.teams ?? data.results ?? []
        setTeams(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load teams')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return (
    <div className="card shadow-sm rounded-4">
      <div className="card-header px-4 py-3 rounded-top-4">
        <h2 className="h4 mb-0">Teams</h2>
      </div>
      <div className="card-body p-4">
        {loading && <p className="text-muted mb-0">Loading teams...</p>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Members</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                {teams.length > 0 ? (
                  teams.map((team, index) => (
                    <tr key={team.id ?? team._id ?? `${team.name ?? 'team'}-${index}`}>
                      <td>{team.name ?? '—'}</td>
                      <td>{team.members?.length ?? team.memberCount ?? '—'}</td>
                      <td>{team.region ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-muted text-center">
                      No teams found.
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

export default Teams
