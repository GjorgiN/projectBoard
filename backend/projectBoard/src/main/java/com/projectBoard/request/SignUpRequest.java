package com.projectBoard.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class SignUpRequest {

	private String firstName;

	private String lastName;

	private String username;

	private String password;

	private String email;

	private String phoneNumber;

}
