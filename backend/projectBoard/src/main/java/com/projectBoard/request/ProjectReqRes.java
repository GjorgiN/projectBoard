package com.projectBoard.request;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.projectBoard.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data	

public class ProjectReqRes {

	String id;
	String title;
	String description;
	Map<String, SectionResReq> sections;
	Map<String, TaskResponse> tasks;
	List<String> sectionsOrder;
	Set<User> owners;
	Set<User> members;
	
}
