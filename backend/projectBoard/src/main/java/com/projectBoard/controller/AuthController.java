package com.projectBoard.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectBoard.entity.Role;
import com.projectBoard.entity.User;
import com.projectBoard.repository.RoleRepository;
import com.projectBoard.repository.UserRepository;
import com.projectBoard.request.LoginRequest;
import com.projectBoard.request.SignUpRequest;
import com.projectBoard.security.jwt.JwtResponse;
import com.projectBoard.security.jwt.JwtUtils;
import com.projectBoard.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepo;

	@Autowired
	RoleRepository roleRepo;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/signup")
	public ResponseEntity<Object> userSingUp(@Valid @RequestBody SignUpRequest signUpReq) {
		try {
			Boolean usernameInUse = userRepo.existsByUsername(signUpReq.getUsername());
			Boolean emailInUse = userRepo.existsByEmail(signUpReq.getEmail());
			if (usernameInUse || emailInUse) {
				Map<String, Boolean> used = new HashMap<>();

				used.put("username already in use?", usernameInUse);
				used.put("email already in use?", emailInUse);

				return new ResponseEntity<>(used, HttpStatus.BAD_REQUEST);
			}

			User user = new User();
			user.setFirstName(signUpReq.getFirstName());
			user.setLastName(signUpReq.getLastName());
			user.setEmail(signUpReq.getEmail());
			user.setUsername(signUpReq.getUsername());
			user.setPassword(encoder.encode(signUpReq.getPassword()));
			user.setPhoneNumber(signUpReq.getPhoneNumber());

			// set role user for each new user
			Role role = roleRepo.findById(2).get();

			Set<Role> roles = new HashSet<>();
			roles.add(role);

			user.setRoles(roles);

			userRepo.save(user);

			return new ResponseEntity<>("User created successfully.", HttpStatus.CREATED);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong...", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/signin")
	public ResponseEntity<Object> signIn(@RequestBody @Valid LoginRequest loginReq) {
		try {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(loginReq.getUsername(), loginReq.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		Set<String> roles = userDetails.getAuthorities().stream().map(authority -> authority.getAuthority())
				.collect(Collectors.toSet());

		JwtResponse response = new JwtResponse(
				jwt,
				userDetails.getId(),
				userDetails.getUsername(),
				userDetails.getEmail(),
				roles);

		return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Authentication failed... " + e.getLocalizedMessage(), HttpStatus.UNAUTHORIZED);
		}
	}

}
