export type HolidayType = 'PUBLIC' | 'SCHOOL'

export interface Holiday {
  countryCode: string
  subdivisionCode: string | null
  name: string
  startDate: string
  endDate: string
  type: HolidayType
  nationwide: boolean
}

export interface AnalysisRow {
  countryCode: string
  subdivisionCode: string | null
  holidays: Holiday[]
}

export interface Selection {
  countryCode: string
  subdivisionCodes: string[] | null
}

export interface Subdivision {
  code: string
  name: string
}

export interface TypeFilter {
  public: boolean
  school: boolean
}

export interface DayDetail {
  name: string
  type: HolidayType
  nationwide: boolean
}

export interface DayCell {
  date: string
  types: HolidayType[]
  details: DayDetail[]
}

export interface AnalysisViewRow {
  countryCode: string
  subdivisionCode: string | null
  days: DayCell[]
  affectedDayCount: number
}
