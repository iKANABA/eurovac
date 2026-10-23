import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson'
import type { Topology } from 'topojson-specification'
import worldAtlas from 'world-atlas/countries-50m.json'
import { EUROPEAN_COUNTRIES, MICRO_STATE_CODES } from '../countries'

const WIDTH = 760
const HEIGHT = 495

const EXCLAVE_BOUNDS = { lonMin: -25, lonMax: 45, latMin: 34, latMax: 72 }
const VIEW_BOUNDS = { lonMin: -25, lonMax: 45, latMin: 34, latMax: 63 }

function withinExclaveBounds([lon, lat]: Position): boolean {
  return lon >= EXCLAVE_BOUNDS.lonMin && lon <= EXCLAVE_BOUNDS.lonMax && lat >= EXCLAVE_BOUNDS.latMin && lat <= EXCLAVE_BOUNDS.latMax
}

function keepMainlandGeometry(geometry: Geometry): Geometry {
  if (geometry.type !== 'MultiPolygon') return geometry
  const kept = geometry.coordinates.filter((polygon) => polygon[0].some(withinExclaveBounds))
  return kept.length > 0 ? { type: 'MultiPolygon', coordinates: kept } : geometry
}

// A closed Polygon ring is ambiguous on a sphere (winding can flip "inside" to
// the far larger complement), which made fitSize compute a wildly wrong scale.
// A MultiPoint of the same corners has no such ambiguity.
const VIEW_BOUNDS_FEATURE: Feature<Geometry> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'MultiPoint',
    coordinates: [
      [VIEW_BOUNDS.lonMin, VIEW_BOUNDS.latMin],
      [VIEW_BOUNDS.lonMax, VIEW_BOUNDS.latMin],
      [VIEW_BOUNDS.lonMax, VIEW_BOUNDS.latMax],
      [VIEW_BOUNDS.lonMin, VIEW_BOUNDS.latMax],
    ],
  },
}

interface CountryShape {
  code: string
  path: string
}

function buildCountryShapes(): CountryShape[] {
  const topology = worldAtlas as unknown as Topology
  const collection = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry>
  const byNumericId = new Map(
    EUROPEAN_COUNTRIES.filter((c) => !MICRO_STATE_CODES.has(c.code)).map((c) => [c.numericId, c.code]),
  )
  const mapFeatures = collection.features
    .filter((f) => byNumericId.has(Number(f.id)))
    .map((f) => ({ ...f, geometry: keepMainlandGeometry(f.geometry) }) as Feature<Geometry>)

  const projection = geoMercator().fitSize([WIDTH, HEIGHT], VIEW_BOUNDS_FEATURE)
  const pathGenerator = geoPath(projection)

  return mapFeatures.map((f) => ({
    code: byNumericId.get(Number(f.id))!,
    path: pathGenerator(f) ?? '',
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
        return (
          <path
            key={shape.code}
            d={shape.path}
            className={`country-shape${selected ? ' country-shape--selected' : ''}`}
            onClick={() => onToggle(shape.code)}
          >
            <title>{shape.code}</title>
          </path>
        )
      })}
    </svg>
  )
}
