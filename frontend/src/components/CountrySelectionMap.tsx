import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson'
import type { Topology } from 'topojson-specification'
import worldAtlas from 'world-atlas/countries-50m.json'
import { EUROPEAN_COUNTRIES, MICRO_STATE_CODES } from '../countries'

const WIDTH = 760
const HEIGHT = 620

const EUROPE_BOUNDS = { lonMin: -25, lonMax: 45, latMin: 34, latMax: 72 }

function withinEurope([lon, lat]: Position): boolean {
  return lon >= EUROPE_BOUNDS.lonMin && lon <= EUROPE_BOUNDS.lonMax && lat >= EUROPE_BOUNDS.latMin && lat <= EUROPE_BOUNDS.latMax
}

function keepMainlandGeometry(geometry: Geometry): Geometry {
  if (geometry.type !== 'MultiPolygon') return geometry
  const kept = geometry.coordinates.filter((polygon) => polygon[0].some(withinEurope))
  return kept.length > 0 ? { type: 'MultiPolygon', coordinates: kept } : geometry
}

const MICRO_STATE_OFFSETS: Record<string, [number, number]> = {
  AD: [-45, 15],
  MC: [40, 15],
  SM: [40, -10],
  VA: [-35, 20],
  LI: [15, -40],
  MT: [20, -35],
}

interface CountryShape {
  code: string
  path: string
  centroid: [number, number]
}

function buildCountryShapes(): CountryShape[] {
  const topology = worldAtlas as unknown as Topology
  const collection = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry>
  const byNumericId = new Map(EUROPEAN_COUNTRIES.map((c) => [c.numericId, c.code]))
  const europeFeatures = collection.features
    .filter((f) => byNumericId.has(Number(f.id)))
    .map((f) => ({ ...f, geometry: keepMainlandGeometry(f.geometry) }) as Feature<Geometry>)

  const projection = geoMercator().fitSize([WIDTH, HEIGHT], { type: 'FeatureCollection', features: europeFeatures })
  const pathGenerator = geoPath(projection)

  return europeFeatures.map((f) => ({
    code: byNumericId.get(Number(f.id))!,
    path: pathGenerator(f) ?? '',
    centroid: pathGenerator.centroid(f),
  }))
}

const COUNTRY_SHAPES = buildCountryShapes()

interface CountrySelectionMapProps {
  selectedCountries: Set<string>
  onToggle: (countryCode: string) => void
}

export function CountrySelectionMap({ selectedCountries, onToggle }: CountrySelectionMapProps) {
  return (
    <svg
      className="europe-map"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="group"
      aria-label="Länderauswahl"
    >
      {COUNTRY_SHAPES.map((shape) => {
        const selected = selectedCountries.has(shape.code)
        const isMicroState = MICRO_STATE_CODES.has(shape.code)
        return (
          <path
            key={shape.code}
            d={shape.path}
            className={`country-shape${selected ? ' country-shape--selected' : ''}`}
            onClick={isMicroState ? undefined : () => onToggle(shape.code)}
            style={isMicroState ? { pointerEvents: 'none' } : undefined}
          >
            <title>{shape.code}</title>
          </path>
        )
      })}

      {COUNTRY_SHAPES.filter((s) => MICRO_STATE_CODES.has(s.code)).map((shape) => {
        const [dx, dy] = MICRO_STATE_OFFSETS[shape.code] ?? [30, 0]
        const [cx, cy] = shape.centroid
        const bubbleX = cx + dx
        const bubbleY = cy + dy
        const selected = selectedCountries.has(shape.code)
        return (
          <g key={`micro-${shape.code}`}>
            <line x1={cx} y1={cy} x2={bubbleX} y2={bubbleY} className="micro-state-leader" />
            <circle
              cx={bubbleX}
              cy={bubbleY}
              r={11}
              className={`micro-state-dot${selected ? ' micro-state-dot--selected' : ''}`}
              onClick={() => onToggle(shape.code)}
            />
            <text x={bubbleX} y={bubbleY} className="micro-state-label">
              {shape.code}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
