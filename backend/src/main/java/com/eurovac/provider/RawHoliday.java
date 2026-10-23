package com.eurovac.provider;

import com.eurovac.model.HolidayType;

import java.time.LocalDate;
import java.util.List;

public record RawHoliday(
        String name,
        LocalDate startDate,
        LocalDate endDate,
        HolidayType type,
        boolean nationwide,
        List<String> subdivisionCodes
) {
}
