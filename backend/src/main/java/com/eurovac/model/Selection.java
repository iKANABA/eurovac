package com.eurovac.model;

import java.util.List;

public record Selection(String countryCode, List<String> subdivisionCodes) {
}
