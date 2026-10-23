package com.eurovac.client;

import com.eurovac.client.dto.ApiHolidayDto;
import com.eurovac.client.dto.SubdivisionDto;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.time.LocalDate;
import java.util.List;

@RegisterRestClient(configKey = "openholidaysapi")
public interface OpenHolidaysApiClient {

    @GET
    @Path("/PublicHolidays")
    List<ApiHolidayDto> publicHolidays(
            @QueryParam("countryIsoCode") String countryIsoCode,
            @QueryParam("languageIsoCode") String languageIsoCode,
            @QueryParam("validFrom") LocalDate validFrom,
            @QueryParam("validTo") LocalDate validTo
    );

    @GET
    @Path("/SchoolHolidays")
    List<ApiHolidayDto> schoolHolidays(
            @QueryParam("countryIsoCode") String countryIsoCode,
            @QueryParam("languageIsoCode") String languageIsoCode,
            @QueryParam("validFrom") LocalDate validFrom,
            @QueryParam("validTo") LocalDate validTo
    );

    @GET
    @Path("/Subdivisions")
    List<SubdivisionDto> subdivisions(
            @QueryParam("countryIsoCode") String countryIsoCode,
            @QueryParam("languageIsoCode") String languageIsoCode
    );
}
