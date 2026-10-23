package com.eurovac;

import com.eurovac.model.AnalysisRequest;
import com.eurovac.model.AnalysisRow;
import com.eurovac.model.Holiday;
import com.eurovac.provider.HolidayProvider;
import com.eurovac.provider.Subdivision;
import com.eurovac.service.HolidayAnalysisService;
import com.eurovac.service.HolidayService;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
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

    @Inject
    HolidayAnalysisService holidayAnalysisService;

    @Inject
    HolidayProvider holidayProvider;

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

    @GET
    @Path("/subdivisions")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Subdivision> getSubdivisions(@QueryParam("country") String countryCode) {
        return holidayProvider.subdivisions(countryCode);
    }

    @POST
    @Path("/analysis")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<AnalysisRow> analyze(AnalysisRequest request) {
        if (request == null || request.selections() == null) {
            throw new BadRequestException("selections must be provided");
        }
        LocalDate effectiveFrom = request.from() != null ? request.from() : LocalDate.now();
        LocalDate effectiveTo = request.to() != null ? request.to() : effectiveFrom.plusMonths(3);
        return holidayAnalysisService.analyze(request.selections(), effectiveFrom, effectiveTo);
    }
}
