import type { AnalysisRow, Selection, Subdivision } from './types'

export async function fetchAnalysis(selections: Selection[], from: string, to: string): Promise<AnalysisRow[]> {
  const res = await fetch('/api/holidays/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selections, from, to }),
  })
  if (!res.ok) throw new Error(`Analyse fehlgeschlagen: ${res.status}`)
  return res.json()
}

export async function fetchSubdivisions(countryCode: string): Promise<Subdivision[]> {
  const res = await fetch(`/api/holidays/subdivisions?country=${countryCode}`)
  if (!res.ok) throw new Error(`Bundesländer-Abfrage fehlgeschlagen: ${res.status}`)
  return res.json()
}
