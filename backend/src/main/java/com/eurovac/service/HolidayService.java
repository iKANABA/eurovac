package com.eurovac.service;

import com.eurovac.model.Holiday;
import com.eurovac.provider.HolidayProvider;
import com.eurovac.provider.RawHoliday;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class HolidayService {

    @Inject
    HolidayProvider holidayProvider;

    public List<Holiday> getHolidays(String countryCode, String subdivisionCode, LocalDate from, LocalDate to) {
        List<RawHoliday> raw = new ArrayList<>();
        raw.addAll(holidayProvider.publicHolidays(countryCode, from, to));
        raw.addAll(holidayProvider.schoolHolidays(countryCode, from, to));

        return HolidayMapper.toHolidays(countryCode, subdivisionCode, raw).stream()
                .sorted((a, b) -> a.startDate().compareTo(b.startDate()))
                .toList();
    }
}
