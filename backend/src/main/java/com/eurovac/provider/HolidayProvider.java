package com.eurovac.provider;

import java.time.LocalDate;
import java.util.List;

public interface HolidayProvider {

    List<RawHoliday> publicHolidays(String countryCode, LocalDate from, LocalDate to);

    List<RawHoliday> schoolHolidays(String countryCode, LocalDate from, LocalDate to);

    List<Subdivision> subdivisions(String countryCode);
}
