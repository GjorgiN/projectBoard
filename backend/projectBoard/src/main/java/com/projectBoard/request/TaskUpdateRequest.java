package com.projectBoard.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class TaskUpdateRequest {

	Long id;
	
	Integer orderId;

	String title;

	Long dueDate;

	Boolean completed;

	Long assignedUserId;

	String attachmentLocation;

}
