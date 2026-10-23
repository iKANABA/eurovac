package com.eurovac.provider;

import com.eurovac.client.OpenHolidaysApiClient;
import com.eurovac.client.dto.ApiHolidayDto;
import com.eurovac.client.dto.SubdivisionDto;
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
    public List<RawHoliday> publicHolidays(String countryCode, LocalDate from, LocalDate to) {
        return client.publicHolidays(countryCode, "EN", from, to).stream().map(this::toRawHoliday).toList();
    }

    @Override
    public List<RawHoliday> schoolHolidays(String countryCode, LocalDate from, LocalDate to) {
        return client.schoolHolidays(countryCode, "EN", from, to).stream().map(this::toRawHoliday).toList();
    }

    @Override
    public List<Subdivision> subdivisions(String countryCode) {
        return client.subdivisions(countryCode, "EN").stream()
                .map(dto -> new Subdivision(dto.code(), dto.name().isEmpty() ? dto.code() : dto.name().get(0).text()))
                .toList();
    }

    private RawHoliday toRawHoliday(ApiHolidayDto dto) {
        String name = dto.name().isEmpty() ? dto.type() : dto.name().get(0).text();
        HolidayType type = "School".equalsIgnoreCase(dto.type()) ? HolidayType.SCHOOL : HolidayType.PUBLIC;
        List<String> subdivisionCodes = dto.subdivisions() == null
                ? List.of()
                : dto.subdivisions().stream().map(com.eurovac.client.dto.SubdivisionRef::code).toList();
        return new RawHoliday(name, dto.startDate(), dto.endDate(), type, dto.nationwide(), subdivisionCodes);
    }
}
