package com.eurovac.client.dto;

import java.time.LocalDate;
import java.util.List;

public record ApiHolidayDto(
        String id,
        LocalDate startDate,
        LocalDate endDate,
        String type,
        List<LocalizedText> name,
        boolean nationwide,
        List<SubdivisionRef> subdivisions
) {
}
