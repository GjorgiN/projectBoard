package com.projectBoard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projectBoard.entity.User;
import com.projectBoard.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	UserRepository userRepo;

	@GetMapping("/getall")
	public List<User> getUsers() {
		return userRepo.findAll();

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@GetMapping("/finduser")
	public ResponseEntity<?> findUserByUsername(@RequestParam String username) {
		try {
			return new ResponseEntity<>(userRepo.searchUserByUsername(username), HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}
