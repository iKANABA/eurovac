import { EUROPEAN_COUNTRIES } from '../countries'

interface CountrySelectionMapProps {
  selectedCountries: Set<string>
  onToggle: (countryCode: string) => void
}

export function CountrySelectionMap({ selectedCountries, onToggle }: CountrySelectionMapProps) {
  return (
    <div className="country-map" role="group" aria-label="Länderauswahl">
      {EUROPEAN_COUNTRIES.map((country) => {
        const selected = selectedCountries.has(country.code)
        return (
          <button
            key={country.code}
            type="button"
            className={`country-dot${selected ? ' country-dot--selected' : ''}`}
            style={{ left: `${country.x}%`, top: `${country.y}%` }}
            onClick={() => onToggle(country.code)}
            title={country.name}
            aria-pressed={selected}
          >
            {country.code}
          </button>
        )
      })}
    </div>
  )
}
