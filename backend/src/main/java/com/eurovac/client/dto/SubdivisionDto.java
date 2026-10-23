package com.eurovac.client.dto;

import java.util.List;

public record SubdivisionDto(String code, List<LocalizedText> name) {
}
