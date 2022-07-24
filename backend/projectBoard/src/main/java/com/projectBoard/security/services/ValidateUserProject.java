package com.projectBoard.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.projectBoard.entity.User;
import com.projectBoard.repository.UserRepository;

@Service
public class ValidateUserProject {

	@Autowired
	UserRepository userRepo;

	public String getUserCredentialsPerProject(Long projectId) {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = userDetails.getUsername();
		User requester = userRepo.findByUsername(username).get();

		if (userRepo.isOwnerOfProject(requester.getId(), projectId))
			return "owner";

		if (userRepo.isMemberOfProject(requester.getId(), projectId))
			return "member";

		return "none";

	}

}
