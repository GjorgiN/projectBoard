package com.projectBoard.security.jwt;

import java.util.Set;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data

public class JwtResponse {

	private String token;

	private final String type = "Bearer";

	private Long id;

	private String username;

	private String email;

	private Set<String> roles;

	public JwtResponse(String token, Long id, String username, String email, Set<String> roles) {
		super();
		this.token = token;
		this.id = id;
		this.username = username;
		this.email = email;
		this.roles = roles;
	}
}

