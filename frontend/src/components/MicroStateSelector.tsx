import { EUROPEAN_COUNTRIES, MICRO_STATE_CODES } from '../countries'

const MICRO_STATES = EUROPEAN_COUNTRIES.filter((c) => MICRO_STATE_CODES.has(c.code))

interface MicroStateSelectorProps {
  selectedCountries: Set<string>
  onToggle: (countryCode: string) => void
}

export function MicroStateSelector({ selectedCountries, onToggle }: MicroStateSelectorProps) {
  return (
    <fieldset className="micro-state-selector">
      <legend>Kleinstaaten</legend>
      {MICRO_STATES.map((country) => (
        <label key={country.code}>
          <input
            type="checkbox"
            checked={selectedCountries.has(country.code)}
            onChange={() => onToggle(country.code)}
          />
          {country.name}
        </label>
      ))}
    </fieldset>
  )
}
