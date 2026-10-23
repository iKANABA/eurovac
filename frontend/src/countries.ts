export interface CountryInfo {
  code: string
  name: string
  numericId: number
}

export function countryName(code: string): string {
  return EUROPEAN_COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export const MICRO_STATE_CODES = new Set(['AD', 'MC', 'SM', 'VA', 'LI', 'MT'])

export const EUROPEAN_COUNTRIES: CountryInfo[] = [
  { code: 'AD', name: 'Andorra', numericId: 20 },
  { code: 'AL', name: 'Albanien', numericId: 8 },
  { code: 'AT', name: 'Österreich', numericId: 40 },
  { code: 'BE', name: 'Belgien', numericId: 56 },
  { code: 'BG', name: 'Bulgarien', numericId: 100 },
  { code: 'BY', name: 'Belarus', numericId: 112 },
  { code: 'CH', name: 'Schweiz', numericId: 756 },
  { code: 'CZ', name: 'Tschechien', numericId: 203 },
  { code: 'DE', name: 'Deutschland', numericId: 276 },
  { code: 'EE', name: 'Estland', numericId: 233 },
  { code: 'ES', name: 'Spanien', numericId: 724 },
  { code: 'FR', name: 'Frankreich', numericId: 250 },
  { code: 'HR', name: 'Kroatien', numericId: 191 },
  { code: 'HU', name: 'Ungarn', numericId: 348 },
  { code: 'IE', name: 'Irland', numericId: 372 },
  { code: 'IT', name: 'Italien', numericId: 380 },
  { code: 'LI', name: 'Liechtenstein', numericId: 438 },
  { code: 'LT', name: 'Litauen', numericId: 440 },
  { code: 'LU', name: 'Luxemburg', numericId: 442 },
  { code: 'LV', name: 'Lettland', numericId: 428 },
  { code: 'MC', name: 'Monaco', numericId: 492 },
  { code: 'MD', name: 'Moldau', numericId: 498 },
  { code: 'MT', name: 'Malta', numericId: 470 },
  { code: 'NL', name: 'Niederlande', numericId: 528 },
  { code: 'PL', name: 'Polen', numericId: 616 },
  { code: 'PT', name: 'Portugal', numericId: 620 },
  { code: 'RO', name: 'Rumänien', numericId: 642 },
  { code: 'RS', name: 'Serbien', numericId: 688 },
  { code: 'SE', name: 'Schweden', numericId: 752 },
  { code: 'SI', name: 'Slowenien', numericId: 705 },
  { code: 'SK', name: 'Slowakei', numericId: 703 },
  { code: 'SM', name: 'San Marino', numericId: 674 },
  { code: 'VA', name: 'Vatikanstadt', numericId: 336 },
]
