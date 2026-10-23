import { useState } from 'react'
import { sortAnalysisRows } from '../analysis'
import { rowLabel } from '../labels'
import type { AnalysisViewRow } from '../types'

interface TableViewProps {
  rows: AnalysisViewRow[]
  subdivisionNames: Map<string, string>
}

export function TableView({ rows, subdivisionNames }: TableViewProps) {
  const [sortBy, setSortBy] = useState<'affectedDayCount' | 'countryCode'>('affectedDayCount')

  if (rows.length === 0) return <p>Keine Länder ausgewählt.</p>

  const sorted = sortAnalysisRows(rows, sortBy)

  return (
    <div className="table-scroll">
      <table className="analysis-table">
        <thead>
          <tr>
            <th>
              <button type="button" onClick={() => setSortBy('countryCode')}>
                Land / Region
              </button>
            </th>
            <th>
              <button type="button" onClick={() => setSortBy('affectedDayCount')}>
                Betroffene Tage
              </button>
            </th>
            <th>Feiertage / Ferien</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const names = [
              ...new Set(row.days.flatMap((d) => d.details.map((d2) => `${d2.name} (${d2.nationwide ? 'landesweit' : 'regional'})`))),
            ]
            return (
              <tr key={`${row.countryCode}-${row.subdivisionCode ?? 'all'}`}>
                <td>{rowLabel(row.countryCode, row.subdivisionCode, subdivisionNames)}</td>
                <td>{row.affectedDayCount}</td>
                <td title={names.join(', ')}>{names.length === 0 ? '—' : names.join(', ')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
