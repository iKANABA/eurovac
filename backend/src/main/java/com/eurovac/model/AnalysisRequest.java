package com.eurovac.model;

import java.time.LocalDate;
import java.util.List;

public record AnalysisRequest(List<Selection> selections, LocalDate from, LocalDate to) {
}
