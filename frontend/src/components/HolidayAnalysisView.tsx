import { useEffect, useMemo, useState } from 'react'
import { Checkbox, Group, SegmentedControl, Stack } from '@mantine/core'
import { fetchAnalysis, fetchSubdivisions } from '../api'
import { buildHolidayAnalysis } from '../analysis'
import { countryName } from '../countries'
import type { AnalysisRow, Selection, Subdivision, TypeFilter } from '../types'
import { CountrySelectionMap } from './CountrySelectionMap'
import { MicroStateSelector } from './MicroStateSelector'
import { SubdivisionPicker } from './SubdivisionPicker'
import { DateRangePicker } from './DateRangePicker'
import { Legend } from './Legend'
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
  const [subdivisionsByCountry, setSubdivisionsByCountry] = useState<Map<string, Subdivision[]>>(new Map())
  const [from, setFrom] = useState(today())
  const [to, setTo] = useState(defaultTo(today()))
  const [typeFilter, setTypeFilter] = useState<TypeFilter>({ public: true, school: true })
  const [viewMode, setViewMode] = useState<'heatmap' | 'table'>('heatmap')
  const [rawRows, setRawRows] = useState<AnalysisRow[]>([])
  const [error, setError] = useState<string | null>(null)

  const countryCodes = useMemo(() => [...selections.keys()], [selections])

  useEffect(() => {
    const missing = countryCodes.filter((code) => !subdivisionsByCountry.has(code))
    if (missing.length === 0) return
    let cancelled = false
    Promise.all(missing.map((code) => fetchSubdivisions(code).then((result) => [code, result] as const)))
      .then((entries) => {
        if (cancelled) return
        setSubdivisionsByCountry((prev) => {
          const next = new Map(prev)
          for (const [code, result] of entries) next.set(code, result)
          return next
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [countryCodes, subdivisionsByCountry])

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

  const subdivisionNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const list of subdivisionsByCountry.values()) {
      for (const subdivision of list) names.set(subdivision.code, subdivision.name)
    }
    return names
  }, [subdivisionsByCountry])

  return (
    <div className="holiday-analysis">
      <CountrySelectionMap selectedCountries={new Set(countryCodes)} onToggle={toggleCountry} />

      <Group align="stretch" gap="md" mt="md" wrap="wrap">
        <MicroStateSelector selectedCountries={new Set(countryCodes)} onToggle={toggleCountry} />
        {countryCodes.map((code) => (
          <SubdivisionPicker
            key={code}
            countryName={countryName(code)}
            subdivisions={subdivisionsByCountry.get(code) ?? []}
            selectedSubdivisionCodes={selections.get(code) ?? null}
            onChange={(codes) => setSubdivisions(code, codes)}
          />
        ))}
      </Group>

      <Group align="flex-end" gap="xl" my="lg" wrap="wrap">
        <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t) }} />

        <Stack gap={4}>
          <Checkbox
            label="Feiertage"
            checked={typeFilter.public}
            onChange={(e) => setTypeFilter((f) => ({ ...f, public: e.currentTarget.checked }))}
          />
          <Checkbox
            label="Schulferien"
            checked={typeFilter.school}
            onChange={(e) => setTypeFilter((f) => ({ ...f, school: e.currentTarget.checked }))}
          />
        </Stack>

        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as 'heatmap' | 'table')}
          data={[
            { label: 'Heatmap', value: 'heatmap' },
            { label: 'Tabelle', value: 'table' },
          ]}
        />
      </Group>

      {error && <p className="error">Fehler: {error}</p>}

      {countryCodes.length === 0 ? (
        <p>Wähle mindestens ein Land auf der Karte aus, um die Analyse zu starten.</p>
      ) : (
        <>
          {viewMode === 'heatmap' && <Legend />}
          {viewMode === 'heatmap' ? (
            <HeatmapView rows={analysisRows} subdivisionNames={subdivisionNames} />
          ) : (
            <TableView rows={analysisRows} subdivisionNames={subdivisionNames} />
          )}
        </>
      )}
    </div>
  )
}
