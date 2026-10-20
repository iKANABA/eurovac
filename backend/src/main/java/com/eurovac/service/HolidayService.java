package com.eurovac.service;

import com.eurovac.model.Holiday;
import com.eurovac.provider.HolidayProvider;
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
        List<Holiday> holidays = new ArrayList<>();
        holidays.addAll(holidayProvider.publicHolidays(countryCode, subdivisionCode, from, to));
        holidays.addAll(holidayProvider.schoolHolidays(countryCode, subdivisionCode, from, to));
        holidays.sort((a, b) -> a.startDate().compareTo(b.startDate()));
        return holidays;
    }
}
