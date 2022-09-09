package com.projectBoard.request;

import java.sql.Date;
import java.util.Set;

import com.projectBoard.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TaskResponse {

	Long id;

	Integer orderId;

	String title;

	String description;

	Date dueDate;

	Boolean completed;

	User assignedUser;
	
	Set<AttachmentResponse> attachments;

}
