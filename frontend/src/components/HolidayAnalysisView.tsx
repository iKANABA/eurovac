import { useEffect, useMemo, useState } from 'react'
import { fetchAnalysis } from '../api'
import { buildHolidayAnalysis } from '../analysis'
import { countryName } from '../countries'
import type { AnalysisRow, Selection, TypeFilter } from '../types'
import { CountrySelectionMap } from './CountrySelectionMap'
import { SubdivisionPicker } from './SubdivisionPicker'
import { DateRangePicker } from './DateRangePicker'
import { HeatmapView } from './HeatmapView'
import { TableView } from './TableView'

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function today(): string {
  return toDateString(new Date())
}

function defaultTo(from: string): string {
  const [y, m, d] = from.split('-').map(Number)
  return toDateString(new Date(y, m - 1 + 1, d))
}

export function HolidayAnalysisView() {
  const [selections, setSelections] = useState<Map<string, string[] | null>>(new Map())
  const [from, setFrom] = useState(today())
  const [to, setTo] = useState(defaultTo(today()))
  const [typeFilter, setTypeFilter] = useState<TypeFilter>({ public: true, school: true })
  const [viewMode, setViewMode] = useState<'heatmap' | 'table'>('heatmap')
  const [rawRows, setRawRows] = useState<AnalysisRow[]>([])
  const [error, setError] = useState<string | null>(null)

  const countryCodes = useMemo(() => [...selections.keys()], [selections]);

  useEffect(() => {
    if (countryCodes.length === 0) {
      setRawRows([])
      return
    }
    let cancelled = false
    const selectionPayload: Selection[] = countryCodes.map((countryCode) => ({
      countryCode,
      subdivisionCodes: selections.get(countryCode) ?? null,
    }))
    fetchAnalysis(selectionPayload, from, to)
      .then((result) => {
        if (cancelled) return
        setRawRows(result)
        setError(null)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [selections, countryCodes, from, to])

  function toggleCountry(code: string) {
    setSelections((prev) => {
      const next = new Map(prev)
      if (next.has(code)) next.delete(code)
      else next.set(code, null)
      return next
    })
  }

  function setSubdivisions(code: string, subdivisionCodes: string[] | null) {
    setSelections((prev) => new Map(prev).set(code, subdivisionCodes))
  }

  const analysisRows = useMemo(
    () => buildHolidayAnalysis(rawRows, from, to, typeFilter),
    [rawRows, from, to, typeFilter],
  )

  return (
    <div className="holiday-analysis">
      <CountrySelectionMap selectedCountries={new Set(countryCodes)} onToggle={toggleCountry} />

      {countryCodes.length > 0 && (
        <div className="subdivision-pickers">
          {countryCodes.map((code) => (
            <SubdivisionPicker
              key={code}
              countryCode={code}
              countryName={countryName(code)}
              selectedSubdivisionCodes={selections.get(code) ?? null}
              onChange={(codes) => setSubdivisions(code, codes)}
            />
          ))}
        </div>
      )}

      <div className="analysis-controls">
        <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t) }} />

        <label>
          <input
            type="checkbox"
            checked={typeFilter.public}
            onChange={(e) => setTypeFilter((f) => ({ ...f, public: e.target.checked }))}
          />
          Feiertage
        </label>
        <label>
          <input
            type="checkbox"
            checked={typeFilter.school}
            onChange={(e) => setTypeFilter((f) => ({ ...f, school: e.target.checked }))}
          />
          Schulferien
        </label>

        <div className="view-toggle">
          <button type="button" disabled={viewMode === 'heatmap'} onClick={() => setViewMode('heatmap')}>
            Heatmap
          </button>
          <button type="button" disabled={viewMode === 'table'} onClick={() => setViewMode('table')}>
            Tabelle
          </button>
        </div>
      </div>

      {error && <p className="error">Fehler: {error}</p>}

      {countryCodes.length === 0 ? (
        <p>Wähle mindestens ein Land auf der Karte aus, um die Analyse zu starten.</p>
      ) : viewMode === 'heatmap' ? (
        <HeatmapView rows={analysisRows} />
      ) : (
        <TableView rows={analysisRows} />
      )}
    </div>
  )
}
