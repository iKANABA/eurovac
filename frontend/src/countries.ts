export interface CountryInfo {
  code: string
  name: string
  x: number
  y: number
}

export function countryName(code: string): string {
  return EUROPEAN_COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export const EUROPEAN_COUNTRIES: CountryInfo[] = [
  { code: 'AD', name: 'Andorra', x: 28.8, y: 71.2 },
  { code: 'AL', name: 'Albanien', x: 74.5, y: 75.8 },
  { code: 'AT', name: 'Österreich', x: 61.3, y: 51.9 },
  { code: 'BE', name: 'Belgien', x: 36.3, y: 39.2 },
  { code: 'BG', name: 'Bulgarien', x: 88.8, y: 70.4 },
  { code: 'BY', name: 'Belarus', x: 93.8, y: 27.3 },
  { code: 'CH', name: 'Schweiz', x: 45.5, y: 54.6 },
  { code: 'CZ', name: 'Tschechien', x: 63.8, y: 43.1 },
  { code: 'DE', name: 'Deutschland', x: 51.0, y: 37.7 },
  { code: 'EE', name: 'Estland', x: 87.5, y: 9.2 },
  { code: 'ES', name: 'Spanien', x: 15.8, y: 80.8 },
  { code: 'FR', name: 'Frankreich', x: 31.3, y: 55.4 },
  { code: 'HR', name: 'Kroatien', x: 63.0, y: 61.2 },
  { code: 'HU', name: 'Ungarn', x: 73.8, y: 53.1 },
  { code: 'IE', name: 'Irland', x: 5.0, y: 29.2 },
  { code: 'IT', name: 'Italien', x: 56.3, y: 70.0 },
  { code: 'LI', name: 'Liechtenstein', x: 48.8, y: 53.1 },
  { code: 'LT', name: 'Litauen', x: 84.8, y: 22.3 },
  { code: 'LU', name: 'Luxemburg', x: 40.3, y: 43.1 },
  { code: 'LV', name: 'Lettland', x: 86.5, y: 15.8 },
  { code: 'MC', name: 'Monaco', x: 43.5, y: 66.5 },
  { code: 'MD', name: 'Moldau', x: 96.0, y: 52.3 },
  { code: 'MT', name: 'Malta', x: 61.0, y: 96.5 },
  { code: 'NL', name: 'Niederlande', x: 38.3, y: 34.2 },
  { code: 'PL', name: 'Polen', x: 72.8, y: 35.0 },
  { code: 'PT', name: 'Portugal', x: 4.5, y: 83.1 },
  { code: 'RO', name: 'Rumänien', x: 87.3, y: 58.1 },
  { code: 'RS', name: 'Serbien', x: 77.3, y: 65.4 },
  { code: 'SE', name: 'Schweden', x: 71.5, y: 3.5 },
  { code: 'SI', name: 'Slowenien', x: 62.0, y: 57.3 },
  { code: 'SK', name: 'Slowakei', x: 73.8, y: 47.3 },
  { code: 'SM', name: 'San Marino', x: 56.0, y: 65.8 },
  { code: 'VA', name: 'Vatikanstadt', x: 56.1, y: 73.5 },
]
