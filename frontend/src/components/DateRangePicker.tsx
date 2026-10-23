interface DateRangePickerProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  return (
    <div className="date-range-picker">
      <label>
        Von
        <input
          type="date"
          value={from}
          onChange={(e) => {
            const newFrom = e.target.value
            onChange(newFrom, newFrom > to ? newFrom : to)
          }}
        />
      </label>
      <label>
        Bis
        <input type="date" value={to} min={from} onChange={(e) => onChange(from, e.target.value)} />
      </label>
    </div>
  )
}
