import { describe, expect, it } from 'vitest'
import { buildHolidayAnalysis, sortAnalysisRows } from './analysis'
import type { AnalysisRow } from './types'

const allTypes = { public: true, school: true }

describe('buildHolidayAnalysis', () => {
  it('marks a single-day holiday as affecting exactly one day', () => {
    const rows: AnalysisRow[] = [
      {
        countryCode: 'FR',
        subdivisionCode: null,
        holidays: [
          { countryCode: 'FR', subdivisionCode: null, name: 'Fête nationale', startDate: '2026-07-14', endDate: '2026-07-14', type: 'PUBLIC', nationwide: true },
        ],
      },
    ]

    const result = buildHolidayAnalysis(rows, '2026-07-10', '2026-07-16', allTypes)

    expect(result[0].affectedDayCount).toBe(1)
    expect(result[0].days.find((d) => d.date === '2026-07-14')?.types).toEqual(['PUBLIC'])
    expect(result[0].days.find((d) => d.date === '2026-07-10')?.types).toEqual([])
  })

  it('marks every day of a multi-day holiday range as affected', () => {
    const rows: AnalysisRow[] = [
      {
        countryCode: 'DE',
        subdivisionCode: 'DE-BY',
        holidays: [
          { countryCode: 'DE', subdivisionCode: 'DE-BY', name: 'Sommerferien', startDate: '2026-08-03', endDate: '2026-08-05', type: 'SCHOOL', nationwide: false },
        ],
      },
    ]

    const result = buildHolidayAnalysis(rows, '2026-08-01', '2026-08-07', allTypes)

    expect(result[0].affectedDayCount).toBe(3)
    expect(result[0].days.filter((d) => d.types.length > 0).map((d) => d.date)).toEqual([
      '2026-08-03',
      '2026-08-04',
      '2026-08-05',
    ])
  })

  it('hides a type when the type filter disables it', () => {
    const rows: AnalysisRow[] = [
      {
        countryCode: 'DE',
        subdivisionCode: null,
        holidays: [
          { countryCode: 'DE', subdivisionCode: null, name: 'Neujahr', startDate: '2026-01-01', endDate: '2026-01-01', type: 'PUBLIC', nationwide: true },
          { countryCode: 'DE', subdivisionCode: null, name: 'Osterferien', startDate: '2026-01-02', endDate: '2026-01-02', type: 'SCHOOL', nationwide: true },
        ],
      },
    ]

    const result = buildHolidayAnalysis(rows, '2026-01-01', '2026-01-02', { public: true, school: false })

    expect(result[0].affectedDayCount).toBe(1)
    expect(result[0].days.find((d) => d.date === '2026-01-02')?.types).toEqual([])
  })

  it('sorts rows ascending by affected day count by default', () => {
    const rows: AnalysisRow[] = [
      {
        countryCode: 'DE',
        subdivisionCode: null,
        holidays: [
          { countryCode: 'DE', subdivisionCode: null, name: 'A', startDate: '2026-01-01', endDate: '2026-01-05', type: 'SCHOOL', nationwide: true },
        ],
      },
      {
        countryCode: 'FR',
        subdivisionCode: null,
        holidays: [],
      },
    ]

    const result = buildHolidayAnalysis(rows, '2026-01-01', '2026-01-05', allTypes)

    expect(result.map((r) => r.countryCode)).toEqual(['FR', 'DE'])
  })

  it('carries the nationwide flag through to day details', () => {
    const rows: AnalysisRow[] = [
      {
        countryCode: 'DE',
        subdivisionCode: 'DE-BY',
        holidays: [
          { countryCode: 'DE', subdivisionCode: 'DE-BY', name: 'Heilige Drei Könige', startDate: '2026-01-06', endDate: '2026-01-06', type: 'PUBLIC', nationwide: false },
        ],
      },
    ]

    const result = buildHolidayAnalysis(rows, '2026-01-06', '2026-01-06', allTypes)

    expect(result[0].days[0].details[0].nationwide).toBe(false)
  })
})

describe('sortAnalysisRows', () => {
  it('re-sorts alphabetically by country code', () => {
    const rows = buildHolidayAnalysis(
      [
        { countryCode: 'FR', subdivisionCode: null, holidays: [] },
        { countryCode: 'DE', subdivisionCode: null, holidays: [] },
      ],
      '2026-01-01',
      '2026-01-02',
      allTypes,
    )

    const sorted = sortAnalysisRows(rows, 'countryCode')

    expect(sorted.map((r) => r.countryCode)).toEqual(['DE', 'FR'])
  })
})
