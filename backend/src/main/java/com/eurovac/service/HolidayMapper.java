package com.eurovac.service;

import com.eurovac.model.Holiday;
import com.eurovac.provider.RawHoliday;

import java.util.List;

final class HolidayMapper {

    private HolidayMapper() {
    }

    static List<Holiday> toHolidays(String countryCode, String subdivisionCode, List<RawHoliday> raw) {
        return raw.stream()
                .filter(h -> subdivisionCode == null || h.nationwide() || h.subdivisionCodes().contains(subdivisionCode))
                .map(h -> new Holiday(countryCode, subdivisionCode, h.name(), h.startDate(), h.endDate(), h.type(), h.nationwide()))
                .toList();
    }
}
