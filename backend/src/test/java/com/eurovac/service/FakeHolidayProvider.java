package com.eurovac.service;

import com.eurovac.provider.HolidayProvider;
import com.eurovac.provider.RawHoliday;
import com.eurovac.provider.Subdivision;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class FakeHolidayProvider implements HolidayProvider {

    private final Map<String, List<RawHoliday>> publicHolidays = new HashMap<>();
    private final Map<String, List<RawHoliday>> schoolHolidays = new HashMap<>();
    private final Map<String, List<Subdivision>> subdivisions = new HashMap<>();

    FakeHolidayProvider withPublicHolidays(String countryCode, RawHoliday... holidays) {
        publicHolidays.put(countryCode, List.of(holidays));
        return this;
    }

    FakeHolidayProvider withSchoolHolidays(String countryCode, RawHoliday... holidays) {
        schoolHolidays.put(countryCode, List.of(holidays));
        return this;
    }

    FakeHolidayProvider withSubdivisions(String countryCode, Subdivision... values) {
        subdivisions.put(countryCode, List.of(values));
        return this;
    }

    @Override
    public List<RawHoliday> publicHolidays(String countryCode, LocalDate from, LocalDate to) {
        return publicHolidays.getOrDefault(countryCode, List.of());
    }

    @Override
    public List<RawHoliday> schoolHolidays(String countryCode, LocalDate from, LocalDate to) {
        return schoolHolidays.getOrDefault(countryCode, List.of());
    }

    @Override
    public List<Subdivision> subdivisions(String countryCode) {
        return subdivisions.getOrDefault(countryCode, List.of());
    }
}
