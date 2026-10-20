package com.eurovac.provider;

import com.eurovac.model.Holiday;

import java.time.LocalDate;
import java.util.List;

public interface HolidayProvider {

    List<Holiday> publicHolidays(String countryCode, String subdivisionCode, LocalDate from, LocalDate to);

    List<Holiday> schoolHolidays(String countryCode, String subdivisionCode, LocalDate from, LocalDate to);
}
