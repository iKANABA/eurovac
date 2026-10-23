package com.eurovac.service;

import com.eurovac.model.AnalysisRow;
import com.eurovac.model.HolidayType;
import com.eurovac.model.Selection;
import com.eurovac.provider.RawHoliday;
import com.eurovac.provider.Subdivision;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HolidayAnalysisServiceTest {

    private final LocalDate from = LocalDate.of(2026, 1, 1);
    private final LocalDate to = LocalDate.of(2026, 12, 31);

    @Test
    void nationwideHolidayExpandsToEverySubdivisionOfASelectedCountry() {
        RawHoliday newYear = new RawHoliday("Neujahr", from, from, HolidayType.PUBLIC, true, List.of());
        FakeHolidayProvider provider = new FakeHolidayProvider()
                .withPublicHolidays("DE", newYear)
                .withSubdivisions("DE", new Subdivision("DE-BY", "Bavaria"), new Subdivision("DE-BE", "Berlin"));

        List<AnalysisRow> rows = new HolidayAnalysisService(provider)
                .analyze(List.of(new Selection("DE", null)), from, to);

        assertEquals(2, rows.size());
        assertTrue(rows.stream().allMatch(row -> row.holidays().size() == 1));
        assertTrue(rows.stream().anyMatch(row -> "DE-BY".equals(row.subdivisionCode())));
        assertTrue(rows.stream().anyMatch(row -> "DE-BE".equals(row.subdivisionCode())));
    }

    @Test
    void regionalHolidayOnlyAppliesToItsListedSubdivisions() {
        RawHoliday epiphany = new RawHoliday("Heilige Drei Könige", LocalDate.of(2026, 1, 6), LocalDate.of(2026, 1, 6),
                HolidayType.PUBLIC, false, List.of("DE-BY"));
        FakeHolidayProvider provider = new FakeHolidayProvider()
                .withPublicHolidays("DE", epiphany)
                .withSubdivisions("DE", new Subdivision("DE-BY", "Bavaria"), new Subdivision("DE-BE", "Berlin"));

        List<AnalysisRow> rows = new HolidayAnalysisService(provider)
                .analyze(List.of(new Selection("DE", null)), from, to);

        AnalysisRow bavaria = rows.stream().filter(row -> "DE-BY".equals(row.subdivisionCode())).findFirst().orElseThrow();
        AnalysisRow berlin = rows.stream().filter(row -> "DE-BE".equals(row.subdivisionCode())).findFirst().orElseThrow();
        assertEquals(1, bavaria.holidays().size());
        assertTrue(berlin.holidays().isEmpty());
    }

    @Test
    void countryWithoutSubdivisionsYieldsASingleRow() {
        RawHoliday nationalDay = new RawHoliday("Fête nationale", LocalDate.of(2026, 7, 14), LocalDate.of(2026, 7, 14),
                HolidayType.PUBLIC, true, List.of());
        FakeHolidayProvider provider = new FakeHolidayProvider().withPublicHolidays("FR", nationalDay);

        List<AnalysisRow> rows = new HolidayAnalysisService(provider)
                .analyze(List.of(new Selection("FR", null)), from, to);

        assertEquals(1, rows.size());
        assertEquals("FR", rows.get(0).countryCode());
        assertEquals(null, rows.get(0).subdivisionCode());
        assertEquals(1, rows.get(0).holidays().size());
    }

    @Test
    void multipleRequestedCountriesMergeIntoOneResponse() {
        RawHoliday deHoliday = new RawHoliday("Neujahr", from, from, HolidayType.PUBLIC, true, List.of());
        RawHoliday frHoliday = new RawHoliday("Fête nationale", LocalDate.of(2026, 7, 14), LocalDate.of(2026, 7, 14),
                HolidayType.PUBLIC, true, List.of());
        FakeHolidayProvider provider = new FakeHolidayProvider()
                .withPublicHolidays("DE", deHoliday)
                .withPublicHolidays("FR", frHoliday);

        List<AnalysisRow> rows = new HolidayAnalysisService(provider)
                .analyze(List.of(new Selection("DE", null), new Selection("FR", null)), from, to);

        assertEquals(2, rows.size());
        assertTrue(rows.stream().anyMatch(row -> "DE".equals(row.countryCode())));
        assertTrue(rows.stream().anyMatch(row -> "FR".equals(row.countryCode())));
    }

    @Test
    void explicitSubdivisionSelectionIsNotExpandedBeyondWhatWasRequested() {
        RawHoliday epiphany = new RawHoliday("Heilige Drei Könige", LocalDate.of(2026, 1, 6), LocalDate.of(2026, 1, 6),
                HolidayType.PUBLIC, false, List.of("DE-BY"));
        FakeHolidayProvider provider = new FakeHolidayProvider()
                .withPublicHolidays("DE", epiphany)
                .withSubdivisions("DE", new Subdivision("DE-BY", "Bavaria"), new Subdivision("DE-BE", "Berlin"));

        List<AnalysisRow> rows = new HolidayAnalysisService(provider)
                .analyze(List.of(new Selection("DE", List.of("DE-BY"))), from, to);

        assertEquals(1, rows.size());
        assertEquals("DE-BY", rows.get(0).subdivisionCode());
    }

    @Test
    void explicitlyEmptySubdivisionSelectionYieldsNoRowsForThatCountry() {
        RawHoliday newYear = new RawHoliday("Neujahr", from, from, HolidayType.PUBLIC, true, List.of());
        FakeHolidayProvider provider = new FakeHolidayProvider()
                .withPublicHolidays("DE", newYear)
                .withSubdivisions("DE", new Subdivision("DE-BY", "Bavaria"), new Subdivision("DE-BE", "Berlin"));

        List<AnalysisRow> rows = new HolidayAnalysisService(provider)
                .analyze(List.of(new Selection("DE", List.of())), from, to);

        assertTrue(rows.isEmpty());
    }
}
