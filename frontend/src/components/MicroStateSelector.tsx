import { Checkbox, Paper, Stack, Text } from '@mantine/core'
import { EUROPEAN_COUNTRIES, MICRO_STATE_CODES } from '../countries'

const MICRO_STATES = EUROPEAN_COUNTRIES.filter((c) => MICRO_STATE_CODES.has(c.code))

interface MicroStateSelectorProps {
  selectedCountries: Set<string>
  onToggle: (countryCode: string) => void
}

export function MicroStateSelector({ selectedCountries, onToggle }: MicroStateSelectorProps) {
  return (
    <Paper withBorder radius="md" p="sm" className="selection-card">
      <Text size="sm" fw={600} mb="xs">
        Kleinstaaten
      </Text>
      <Stack gap={6}>
        {MICRO_STATES.map((country) => (
          <Checkbox
            key={country.code}
            label={country.name}
            checked={selectedCountries.has(country.code)}
            onChange={() => onToggle(country.code)}
          />
        ))}
      </Stack>
    </Paper>
  )
}
