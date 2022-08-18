package com.projectBoard.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateTaskDueDateReq {

	Long id;
	Long dueDate;
	
}
