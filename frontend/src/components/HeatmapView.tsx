import { countryName } from '../countries'
import type { AnalysisViewRow } from '../types'

interface HeatmapViewProps {
  rows: AnalysisViewRow[]
}

function cellClass(types: ('PUBLIC' | 'SCHOOL')[]): string {
  if (types.includes('PUBLIC') && types.includes('SCHOOL')) return 'heatmap-cell heatmap-cell--both'
  if (types.includes('PUBLIC')) return 'heatmap-cell heatmap-cell--public'
  if (types.includes('SCHOOL')) return 'heatmap-cell heatmap-cell--school'
  return 'heatmap-cell'
}

export function HeatmapView({ rows }: HeatmapViewProps) {
  if (rows.length === 0) return <p>Keine Länder ausgewählt.</p>

  return (
    <div className="heatmap-scroll">
      <table className="heatmap">
        <thead>
          <tr>
            <th>Land / Region</th>
            {rows[0].days.map((day) => (
              <th key={day.date} title={day.date}>
                {day.date.slice(8, 10)}.{day.date.slice(5, 7)}.
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.countryCode}-${row.subdivisionCode ?? 'all'}`}>
              <th scope="row">
                {countryName(row.countryCode)}
                {row.subdivisionCode ? ` (${row.subdivisionCode})` : ''}
              </th>
              {row.days.map((day) => (
                <td
                  key={day.date}
                  className={cellClass(day.types)}
                  title={
                    day.details.length > 0
                      ? day.details.map((d) => `${d.name} (${d.type}, ${d.nationwide ? 'landesweit' : 'regional'})`).join(', ')
                      : undefined
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
