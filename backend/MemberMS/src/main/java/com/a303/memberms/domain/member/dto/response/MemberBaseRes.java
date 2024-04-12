package com.a303.memberms.domain.member.dto.response;

import com.a303.memberms.domain.member.Role;
import com.a303.memberms.domain.village.dto.response.VillageBaseRes;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;

@Builder
public record MemberBaseRes(
	int memberId,
	String id,
	String password,
	String socialId,
	String nickname,
	Integer villageId,
	String villageName,
	int level,
	int missionCount,
	int reportCount,
	Role role
) {

}
