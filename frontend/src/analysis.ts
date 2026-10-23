import type { AnalysisRow, AnalysisViewRow, DayCell, TypeFilter } from './types'

function enumerateDates(from: string, to: string): string[] {
  const dates: string[] = []
  let cursor = new Date(`${from}T00:00:00Z`)
  const end = new Date(`${to}T00:00:00Z`)
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor = new Date(cursor.getTime() + 86_400_000)
  }
  return dates
}

function isTypeVisible(type: 'PUBLIC' | 'SCHOOL', typeFilter: TypeFilter): boolean {
  return type === 'PUBLIC' ? typeFilter.public : typeFilter.school
}

export function buildHolidayAnalysis(
  rows: AnalysisRow[],
  from: string,
  to: string,
  typeFilter: TypeFilter,
): AnalysisViewRow[] {
  const dateRange = enumerateDates(from, to)

  const viewRows = rows.map((row) => {
    const days: DayCell[] = dateRange.map((date) => {
      const details = row.holidays
        .filter((h) => isTypeVisible(h.type, typeFilter) && date >= h.startDate && date <= h.endDate)
        .map((h) => ({ name: h.name, type: h.type, nationwide: h.nationwide }))
      const types = [...new Set(details.map((d) => d.type))]
      return { date, types, details }
    })

    return {
      countryCode: row.countryCode,
      subdivisionCode: row.subdivisionCode,
      days,
      affectedDayCount: days.filter((d) => d.types.length > 0).length,
    }
  })

  return sortAnalysisRows(viewRows, 'affectedDayCount')
}

export function sortAnalysisRows(
  rows: AnalysisViewRow[],
  by: 'affectedDayCount' | 'countryCode',
): AnalysisViewRow[] {
  const sorted = [...rows]
  if (by === 'affectedDayCount') {
    sorted.sort((a, b) => a.affectedDayCount - b.affectedDayCount)
  } else {
    sorted.sort((a, b) => a.countryCode.localeCompare(b.countryCode) || (a.subdivisionCode ?? '').localeCompare(b.subdivisionCode ?? ''))
  }
  return sorted
}
