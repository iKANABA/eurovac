# Deferred: dedicated selector for small/hard-to-draw countries

**Status:** noted, not scheduled.

Background: the interactive map removed the magnified-callout treatment for micro-states (Andorra, Monaco, San Marino, Vatican City, Liechtenstein, Malta) in favor of a plain checkbox list below the map (see `HolidayAnalysisView`/`MicroStateSelector`). That list is a minimal stand-in, not the intended final UX.

Idea for later: a proper standalone selection feature — e.g. a searchable/filterable list of countries (and possibly regions) that's easier to use than clicking a tiny or oddly-shaped area on the map. Could generalize beyond just the current micro-state set if other countries turn out to be awkward to select geographically. Not designed further for now — revisit if the plain checkbox list feels insufficient.
