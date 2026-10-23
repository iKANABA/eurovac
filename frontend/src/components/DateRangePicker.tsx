import { DatePickerInput } from '@mantine/dates'

interface DateRangePickerProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  return (
    <DatePickerInput
      type="range"
      label="Zeitraum"
      value={[from, to]}
      onChange={(value) => {
        const [start, end] = value
        if (start && end) onChange(start, end)
      }}
      valueFormat="DD.MM.YYYY"
      w={260}
    />
  )
}
