package com.projectBoard.entity;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data


@Entity
@Table
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String firstName;

	private String lastName;

	@Column(unique=true)
	private String username;

	@Column(unique=true)
	private String email;

	private String password;

	private String phoneNumber;

	// causing infinite persist and stack overflow
//	@ManyToMany(mappedBy = "owners")
//	private List<Project> ownedProjects;
//
//	@ManyToMany(mappedBy = "members")
//	private List<Project> onlyMemberOfProjects;
//

	@ManyToMany
	private Set<Role> roles;

}
