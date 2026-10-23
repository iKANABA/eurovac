# Spec: Holiday & School-Holiday Analysis for Trip Planning

**Status:** ready-for-agent (filed locally — no `gh` CLI / GitHub remote configured yet in this environment; copy into a GitHub issue with the `ready-for-agent` label once that's set up)

## Problem Statement

Travelers planning a trip to a European destination (e.g. a theme park) have no easy way to see, for a given date or date range, which neighboring countries and their subdivisions (federal states/regions) currently have public holidays or school holidays. Holiday travelers — both day-trippers on public holidays and families on school holidays — drive visitor numbers and road traffic, so picking a bad date can mean a much busier destination or heavier travel traffic, while a good date can avoid both. Today, checking this requires manually looking up each country's and region's holiday calendar one by one.

## Solution

Eurovac lets the user pick one or more European countries — optionally narrowed down to specific subdivisions/federal states — on an interactive map, plus a date or date range to investigate. For the chosen selection and period, the app shows, per country/subdivision, how many days in the period are affected by a public holiday or school holiday and exactly which days — as either a calendar-style heatmap or a sortable table, whichever the user prefers. Hovering or clicking a cell or row reveals the specific holiday name and whether it's nationwide or regional. This lets the user quickly spot windows where few or none of their selected regions have overlapping holidays.

## User Stories

1. As a user planning a trip, I want to select one or more European countries on an interactive map, so that I can compare several countries' holiday situations at once.
2. As a user, I want to click a country on the map to select or deselect it, so that choosing the countries I care about is fast and visual.
3. As a user who selected a country with federal states/regions, I want to optionally narrow my selection down to specific subdivisions, so that I only see the regions actually relevant to me.
4. As a user, I want a newly selected country to default to "all subdivisions included", so that I don't have to configure anything if I just want the whole country.
5. As a user, I want to enter a date range (from/to) for my analysis, so that I can check an entire trip window at once.
6. As a user, I want to enter a single day by setting the same start and end date, so that I can quickly check one specific date without a separate input mode.
7. As a user, I want to see, for each selected country/subdivision, how many days within my chosen period are affected by a public holiday or school holiday, so that I can compare how busy each option might be.
8. As a user, I want to see exactly which days within the period are affected, not just a total count, so that I can tell apart a single isolated holiday from two weeks of continuous school holidays.
9. As a user, I want public holidays and school holidays to be visually distinguishable, so that I can judge the kind of disruption to expect (e.g. a single non-working day with closed shops vs. a long family-travel season).
10. As a user, I want to show or hide public holidays and/or school holidays independently, so that I can focus on just the type of day relevant to my plans.
11. As a user, I want to view my analysis as a calendar-style heatmap (countries/subdivisions as rows, days as columns), so that I can visually scan the distribution of affected days across the period.
12. As a user, I want to view my analysis as a table (one row per country/subdivision), so that I can quickly identify the quietest options in a compact list.
13. As a user, I want to switch freely between the heatmap view and the table view, so that I can use whichever is more useful for my current question.
14. As a user, I want the table to default to sorting by fewest affected days first, so that the best candidates for my trip are immediately visible.
15. As a user, I want to be able to re-sort the table by other columns (e.g. country name), so that I can also browse alphabetically if I prefer.
16. As a user, I want to hover or click a heatmap cell or table row to see the name of the specific holiday or school holiday, so that I understand exactly what's happening on that day.
17. As a user, I want to see whether a holiday is nationwide or only regional, so that I understand its real-world impact (e.g. whether shops are closed only in one region or across the whole country).
18. As a user, I want the map and selection to only include European countries, so that the tool stays focused on my actual travel area.
19. As a user, I want a country/subdivision with zero affected days in my period to be clearly visible as such, so that I can immediately recognize it as a strong candidate for my trip.
20. As a user, I want my country/subdivision selection and date range to persist while I keep exploring (e.g. switching between heatmap and table, or adjusting the type filter), so that I don't have to reselect everything for every small change.
21. As a first-time user, I want a clear empty state before I've selected any countries, so that I understand I need to make a selection before results appear.
22. As a maintainer, I want the external holiday data access abstracted behind a provider interface, so that another holiday data source can be added later without reworking the analysis logic or the UI.

## Implementation Decisions

### Backend

- New `HolidayAnalysisService` (CDI bean) orchestrates holiday analysis across an arbitrary set of `(countryCode, subdivisionCode)` selections for a date range. This is the single backend seam for this feature's business logic.
- `HolidayProvider` gains a `subdivisions(countryCode): List<Subdivision>` method (new `Subdivision` model: `code`, `name`), implemented by `OpenHolidaysApiProvider` via a new call on `OpenHolidaysApiClient` to OpenHolidaysAPI's `/Subdivisions` endpoint. Needed to expand nationwide holidays across all of a country's subdivisions.
- For each distinct country requested, `HolidayAnalysisService` fetches that country's full public-holiday and school-holiday lists for the date range (no `subdivisionCode` filter) plus its subdivision list, then expands every holiday into the specific subdivisions it applies to: `nationwide = true` → applies to every subdivision of that country (and to the country itself if it has none); otherwise → applies only to the subdivisions listed on the holiday.
- A selection of "whole country, no drill-down" expands server-side into one result row per subdivision the country actually has; a country without subdivisions produces a single country-level row. A selection with explicit `subdivisionCodes` is not expanded beyond what was requested.
- New endpoint `POST /api/holidays/analysis`. Request: a list of selections (`{countryCode, subdivisionCodes: string[] | null}`, where `null`/empty means "all") plus `from`/`to`. Response: a list of rows, each `{countryCode, subdivisionCode, holidays: Holiday[]}` (reusing the existing `Holiday` record — name, startDate, endDate, type), `subdivisionCode` being `null` for countries without subdivisions.
- The existing `GET /api/holidays` endpoint is unchanged and remains available for simple single-country lookups; the new endpoint is additive.

### Frontend

- The set of selectable countries is a fixed, frontend-maintained list of European ISO codes used to render the map; the app never queries OpenHolidaysAPI's full country list at runtime, which keeps the non-European entries (e.g. Brazil, Mexico) out by construction.
- New `CountrySelectionMap` component: an interactive Europe map (SVG/TopoJSON-based) where clicking a country toggles its selection.
- New `SubdivisionPicker` component: shown for a selected country that has subdivisions (via a `GET /api/holidays/subdivisions?country=XX` lookup backed by the new `HolidayProvider.subdivisions`), letting the user deselect specific ones from the default "all" set.
- New `DateRangePicker` component: a single From/To control; the same date in both fields represents a single day.
- New `HolidayAnalysisView` container: holds selection state (countries + per-country subdivision overrides), date-range state, and the Public/School visibility filters; calls `POST /api/holidays/analysis` whenever selection or range changes; computes the shared view model via `buildHolidayAnalysis(...)`; renders either `HeatmapView` or `TableView` based on a view-mode toggle.
- Pure function `buildHolidayAnalysis(rows, from, to, typeFilter)` — the single frontend seam. Converts the raw per-row holiday arrays into one shared structure (per row: per-day affected types plus hover detail, and a total `affectedDayCount`), pre-sorted ascending by `affectedDayCount`. Both `HeatmapView` (columns = calendar days in range) and `TableView` (rows, re-sortable) render this same structure; neither recomputes holiday logic itself.
- `HeatmapView` and `TableView` are presentational only — they render the view model and emit a re-sort/hover event upward.

## Testing Decisions

- Tests target external behavior only — what a function/service returns for given inputs — not internal iteration or grouping details.

### Backend

- Unit-test `HolidayAnalysisService` directly with plain JUnit (no `@QuarkusTest`, no real HTTP), injecting a hand-written fake `HolidayProvider`. Cases: a nationwide holiday expands to every subdivision of a multi-subdivision country; a regional holiday applies only to its listed subdivisions; a country without subdivisions yields a single row; multiple requested countries merge into one response; an explicit `subdivisionCodes` selection isn't expanded beyond what was requested.
- This is the first backend test in the repo — keep it fast and dependency-free rather than spinning up the Quarkus REST layer.

### Frontend

- Unit-test the pure `buildHolidayAnalysis` function with Vitest (new dependency — none configured yet in `frontend/package.json`). Cases: single-day vs. multi-day-range holiday, full-period coverage vs. a single affected day, the type filter hiding Public or School results, default sort order (fewest affected days first), re-sorting by an alternate key.
- `HeatmapView`/`TableView` are intentionally left untested at this level, since they hold no logic of their own; a later rendering smoke test, if ever added, is a separate concern from this spec.

## Out of Scope

- Distance/radius-based automatic subdivision selection around a reference point — deferred to a later version; needs an additional geodata source OpenHolidaysAPI doesn't provide.
- Proactive "find the quietest period(s)" search across a wider horizon — deferred to a later version; this spec only covers reactive analysis of a user-chosen period.
- Persisting selections across browser sessions/reloads — only in-session state is required.
- Countries outside Europe, even if present in OpenHolidaysAPI (e.g. Brazil, Mexico).
- Authentication/user accounts, saved searches, or shareable result links.
- Localization of the UI or holiday names (holiday names are fetched in English, matching the existing `/api/holidays` convention).

## Further Notes

- OpenHolidaysAPI covers roughly 30+ countries, mostly European, with subdivision-level detail only where holidays genuinely vary regionally (e.g. Germany); countries without subdivisions simply produce a single country-level row.
- The existing `GET /api/holidays` endpoint and its CORS configuration (`http://localhost:5173`) are unaffected by this work.
