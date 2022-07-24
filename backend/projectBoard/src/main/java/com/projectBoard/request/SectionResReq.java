package com.projectBoard.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class SectionResReq {

	String id;
	String title;
	String description;
	List<String> tasksIds;
	
}
