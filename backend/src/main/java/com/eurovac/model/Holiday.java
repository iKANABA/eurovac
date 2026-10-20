package com.eurovac.model;

import java.time.LocalDate;

public record Holiday(
        String countryCode,
        String subdivisionCode,
        String name,
        LocalDate startDate,
        LocalDate endDate,
        HolidayType type
) {
}
