package com.projectBoard.entity;

import java.sql.Date;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
@Table
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	Integer orderId;

	String title;

	String description;

	Date dueDate;

	Boolean completed;

	@ManyToOne
	User assignedUser;
	
	@Lob
	@OneToMany
	Set<Attachment> attachments;
}
