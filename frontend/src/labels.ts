import { countryName } from './countries'

export function rowLabel(countryCode: string, subdivisionCode: string | null, subdivisionNames: Map<string, string>): string {
  const country = countryName(countryCode)
  if (!subdivisionCode) return country
  return `${country}, ${subdivisionNames.get(subdivisionCode) ?? subdivisionCode}`
}
