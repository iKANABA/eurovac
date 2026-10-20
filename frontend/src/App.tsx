import { useEffect, useState } from 'react'
import './App.css'

type HolidayType = 'PUBLIC' | 'SCHOOL'

interface Holiday {
  countryCode: string
  subdivisionCode: string | null
  name: string
  startDate: string
  endDate: string
  type: HolidayType
}

function App() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/holidays?country=DE')
      .then((res) => {
        if (!res.ok) throw new Error(`Backend antwortete mit ${res.status}`)
        return res.json()
      })
      .then(setHolidays)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main>
      <h1>Eurovac — Feiertage &amp; Schulferien</h1>
      {error && <p className="error">Fehler beim Laden: {error}</p>}
      <ul>
        {holidays.map((holiday) => (
          <li key={`${holiday.countryCode}-${holiday.name}-${holiday.startDate}`}>
            <strong>{holiday.startDate}</strong>
            {holiday.endDate !== holiday.startDate && <> – {holiday.endDate}</>} — {holiday.name}{' '}
            <span className="badge">{holiday.type}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
