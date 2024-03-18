package com.a303.consultms.domain.consult.dto.response;

import java.util.List;
import lombok.Builder;

@Builder
public record ConsultListRes(
    List<ConsultDetailRes> consultList,
    int totalPages
) {


}
