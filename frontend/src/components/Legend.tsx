export function Legend() {
  return (
    <div className="legend">
      <span className="legend-item">
        <span className="legend-swatch legend-swatch--public" /> Feiertag
      </span>
      <span className="legend-item">
        <span className="legend-swatch legend-swatch--school" /> Schulferien
      </span>
      <span className="legend-item">
        <span className="legend-swatch legend-swatch--both" /> Beides
      </span>
    </div>
  )
}
