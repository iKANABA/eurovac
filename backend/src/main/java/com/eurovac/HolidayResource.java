package com.eurovac;

import com.eurovac.model.Holiday;
import com.eurovac.service.HolidayService;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.util.List;

@Path("/api/holidays")
public class HolidayResource {

    @Inject
    HolidayService holidayService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Holiday> getHolidays(
            @QueryParam("country") @DefaultValue("DE") String countryCode,
            @QueryParam("subdivision") String subdivisionCode,
            @QueryParam("from") LocalDate from,
            @QueryParam("to") LocalDate to
    ) {
        LocalDate effectiveFrom = from != null ? from : LocalDate.now();
        LocalDate effectiveTo = to != null ? to : effectiveFrom.plusMonths(3);
        return holidayService.getHolidays(countryCode, subdivisionCode, effectiveFrom, effectiveTo);
    }
}
