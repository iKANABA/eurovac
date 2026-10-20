package com.eurovac.provider;

import com.eurovac.client.OpenHolidaysApiClient;
import com.eurovac.client.dto.ApiHolidayDto;
import com.eurovac.model.Holiday;
import com.eurovac.model.HolidayType;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class OpenHolidaysApiProvider implements HolidayProvider {

    @RestClient
    OpenHolidaysApiClient client;

    @Override
    public List<Holiday> publicHolidays(String countryCode, String subdivisionCode, LocalDate from, LocalDate to) {
        return client.publicHolidays(countryCode, "EN", from, to, subdivisionCode).stream()
                .map(dto -> toHoliday(dto, countryCode, subdivisionCode))
                .toList();
    }

    @Override
    public List<Holiday> schoolHolidays(String countryCode, String subdivisionCode, LocalDate from, LocalDate to) {
        return client.schoolHolidays(countryCode, "EN", from, to, subdivisionCode).stream()
                .map(dto -> toHoliday(dto, countryCode, subdivisionCode))
                .toList();
    }

    private Holiday toHoliday(ApiHolidayDto dto, String countryCode, String subdivisionCode) {
        String name = dto.name().isEmpty() ? dto.type() : dto.name().get(0).text();
        HolidayType type = "School".equalsIgnoreCase(dto.type()) ? HolidayType.SCHOOL : HolidayType.PUBLIC;
        return new Holiday(countryCode, subdivisionCode, name, dto.startDate(), dto.endDate(), type);
    }
}
