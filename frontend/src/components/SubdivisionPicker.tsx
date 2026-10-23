import { Checkbox, Paper, ScrollArea, Stack, Text } from '@mantine/core'
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
    <Paper withBorder radius="md" p="sm" className="selection-card">
      <Text size="sm" fw={600} mb="xs">
        {countryName}: Bundesländer/Regionen
      </Text>
      <ScrollArea.Autosize mah={150}>
        <Stack gap={6}>
          {subdivisions.map((subdivision) => (
            <Checkbox
              key={subdivision.code}
              label={subdivision.name}
              checked={isChecked(subdivision.code)}
              onChange={() => toggle(subdivision.code)}
            />
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </Paper>
  )
}
