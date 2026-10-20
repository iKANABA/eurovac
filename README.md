# Eurovac

Feiertage & Schulferien in Europa. React/Vite-Frontend, Quarkus-Backend, Datenquelle [OpenHolidaysAPI](https://www.openholidaysapi.org/).

## Struktur

- `backend/` — Quarkus (Java 21, Maven). Ruft OpenHolidaysAPI an, bereitet die Daten auf und stellt sie unter `GET /api/holidays` bereit.
- `frontend/` — React + TypeScript (Vite). Zeigt die vom Backend gelieferten Feiertage/Ferien an.

## Backend starten

```
cd backend
mvn quarkus:dev
```

Läuft auf `http://localhost:8080`. Hinweis: `quarkus:dev` benötigt Maven >= 3.9; falls die installierte Maven-Version älter ist, `./mvnw quarkus:dev` verwenden (lädt sich die passende Version selbst).

### API

`GET /api/holidays?country=DE&subdivision=DE-BY&from=2026-05-01&to=2026-09-30`

- `country` (Default `DE`) — ISO-Ländercode
- `subdivision` (optional) — z.B. Bundesland, siehe `GET https://openholidaysapi.org/Subdivisions?countryIsoCode=DE&languageIsoCode=EN`
- `from` / `to` (optional, Default: heute bis +3 Monate)

Die Anbindung an OpenHolidaysAPI liegt hinter dem `HolidayProvider`-Interface (`backend/src/main/java/com/eurovac/provider`) — ein weiterer Provider für eine andere externe API lässt sich dort ergänzen, ohne `HolidayService` oder den Endpoint anzufassen.

## Frontend starten

```
cd frontend
npm install
npm run dev
```

Läuft auf `http://localhost:5173`, proxied `/api/*` im Dev-Modus zum Backend auf Port 8080.
