package com.eurovac.model;

import java.util.List;

public record AnalysisRow(String countryCode, String subdivisionCode, List<Holiday> holidays) {
}
