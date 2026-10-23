package com.eurovac.service;

import com.eurovac.model.AnalysisRow;
import com.eurovac.model.Selection;
import com.eurovac.provider.HolidayProvider;
import com.eurovac.provider.RawHoliday;
import com.eurovac.provider.Subdivision;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@ApplicationScoped
public class HolidayAnalysisService {

    private record CountryData(List<RawHoliday> holidays, List<Subdivision> subdivisions) {
    }

    private final HolidayProvider holidayProvider;

    @Inject
    public HolidayAnalysisService(HolidayProvider holidayProvider) {
        this.holidayProvider = holidayProvider;
    }

    public List<AnalysisRow> analyze(List<Selection> selections, LocalDate from, LocalDate to) {
        Map<String, CompletableFuture<CountryData>> dataByCountry = selections.stream()
                .map(Selection::countryCode)
                .distinct()
                .collect(Collectors.toMap(code -> code, code -> fetchCountryData(code, from, to)));

        List<AnalysisRow> rows = new ArrayList<>();
        for (Selection selection : selections) {
            CountryData data = dataByCountry.get(selection.countryCode()).join();
            rows.addAll(toRows(selection.countryCode(), selection.subdivisionCodes(), data));
        }
        return rows;
    }

    private CompletableFuture<CountryData> fetchCountryData(String countryCode, LocalDate from, LocalDate to) {
        CompletableFuture<List<RawHoliday>> publicHolidays =
                supplyAsyncWithClassLoader(() -> holidayProvider.publicHolidays(countryCode, from, to));
        CompletableFuture<List<RawHoliday>> schoolHolidays =
                supplyAsyncWithClassLoader(() -> holidayProvider.schoolHolidays(countryCode, from, to));
        CompletableFuture<List<Subdivision>> subdivisions =
                supplyAsyncWithClassLoader(() -> holidayProvider.subdivisions(countryCode));

        return CompletableFuture.allOf(publicHolidays, schoolHolidays, subdivisions).thenApply(v -> {
            List<RawHoliday> raw = new ArrayList<>(publicHolidays.join());
            raw.addAll(schoolHolidays.join());
            return new CountryData(raw, subdivisions.join());
        });
    }

    // ForkJoinPool.commonPool() threads don't carry Quarkus's classloader as their
    // context classloader, which breaks the dynamically generated REST client proxy's
    // reflection-based JSON deserialization. Propagate the caller's classloader explicitly.
    private <T> CompletableFuture<T> supplyAsyncWithClassLoader(Supplier<T> supplier) {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        return CompletableFuture.supplyAsync(() -> {
            Thread thread = Thread.currentThread();
            ClassLoader previous = thread.getContextClassLoader();
            thread.setContextClassLoader(classLoader);
            try {
                return supplier.get();
            } finally {
                thread.setContextClassLoader(previous);
            }
        });
    }

    private List<AnalysisRow> toRows(String countryCode, List<String> requestedSubdivisions, CountryData data) {
        if (requestedSubdivisions == null) {
            if (data.subdivisions().isEmpty()) {
                return List.of(toRow(countryCode, null, data.holidays()));
            }
            return data.subdivisions().stream()
                    .map(subdivision -> toRow(countryCode, subdivision.code(), data.holidays()))
                    .toList();
        }
        return requestedSubdivisions.stream()
                .map(subdivisionCode -> toRow(countryCode, subdivisionCode, data.holidays()))
                .toList();
    }

    private AnalysisRow toRow(String countryCode, String subdivisionCode, List<RawHoliday> raw) {
        return new AnalysisRow(countryCode, subdivisionCode, HolidayMapper.toHolidays(countryCode, subdivisionCode, raw));
    }
}
