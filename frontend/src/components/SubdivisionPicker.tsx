import type { Subdivision } from '../types'

interface SubdivisionPickerProps {
  countryName: string
  subdivisions: Subdivision[]
  selectedSubdivisionCodes: string[] | null
  onChange: (subdivisionCodes: string[] | null) => void
}

export function SubdivisionPicker({ countryName, subdivisions, selectedSubdivisionCodes, onChange }: SubdivisionPickerProps) {
  if (subdivisions.length === 0) return null

  const isChecked = (code: string) => selectedSubdivisionCodes === null || selectedSubdivisionCodes.includes(code)

  function toggle(code: string) {
    const allCodes = subdivisions.map((s) => s.code)
    const current = selectedSubdivisionCodes ?? allCodes
    const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code]
    onChange(next.length === allCodes.length ? null : next)
  }

  return (
    <fieldset className="subdivision-picker">
      <legend>{countryName}: Bundesländer/Regionen</legend>
      {subdivisions.map((subdivision) => (
        <label key={subdivision.code}>
          <input
            type="checkbox"
            checked={isChecked(subdivision.code)}
            onChange={() => toggle(subdivision.code)}
          />
          {subdivision.name}
        </label>
      ))}
    </fieldset>
  )
}
