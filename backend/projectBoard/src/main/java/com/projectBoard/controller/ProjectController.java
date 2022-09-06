package com.projectBoard.controller;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projectBoard.entity.Project;
import com.projectBoard.entity.Section;
import com.projectBoard.entity.Task;
import com.projectBoard.entity.User;
import com.projectBoard.repository.ProjectRepository;
import com.projectBoard.repository.SectionRepository;
import com.projectBoard.repository.TaskRepository;
import com.projectBoard.repository.UserRepository;
import com.projectBoard.request.ProjectReqRes;
import com.projectBoard.request.SectionResReq;
import com.projectBoard.request.TaskUpdateRequest;
import com.projectBoard.request.UpdateTaskDueDateReq;

@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "*")

public class ProjectController {

	@Autowired
	ProjectRepository projectRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	SectionRepository sectionRepo;

	@Autowired
	TaskRepository taskRepo;

	@PreAuthorize("hasRole('ROLE_USER')")
	@PostMapping("/create")
	public ResponseEntity<Object> createProject(@RequestBody Project newProject) {
		try {

			UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
					.getPrincipal();

			String username = userDetails.getUsername();

			User owner = userRepo.findByUsername(username).get();

			Project savedProject = new Project();

			Set<User> owners = new HashSet<>();
			owners.add(owner);
			savedProject.setOwners(owners);

			savedProject.setTitle(newProject.getTitle());
			savedProject.setDescription(newProject.getDescription());
			projectRepo.save(savedProject);

			return new ResponseEntity<>(savedProject, HttpStatus.CREATED);

		} catch (Exception e) {
			System.out.println("Project " + newProject.getTitle() + " cannot be saved.");
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@GetMapping("/myprojects")
	public ResponseEntity<Object> getProjects() {

		try {
			UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
					.getPrincipal();

			String username = userDetails.getUsername();
			User user = userRepo.findByUsername(username).get();

			Optional<List<Project>> ownedProjects = projectRepo.findAllByOwnerId(user.getId());

			Optional<List<Project>> memberOfProjects = projectRepo.findAllIfUserIsMemberByUserId(user.getId());

//			List<Project> projects = projectRepo.findAll();
//			List<Project> ownedProjects = projects.stream().filter(p -> p.getOwners().contains(user))
//					.collect(Collectors.toList());
//			List<Project> memberOfProjects = projects.stream().filter(p -> p.getMembers().contains(user))
//					.collect(Collectors.toList());

			// probably doesn't need to perform this check since owners are not in members
			// set
			if (!memberOfProjects.isEmpty())
				memberOfProjects.get().removeIf(p -> ownedProjects.get().contains(p));

			Map<String, List<ProjectReqRes>> allProjects = new HashMap<>();

			if (!ownedProjects.isEmpty()) {
				List<ProjectReqRes> ownedProjectsReqRes = ownedProjects.get().stream()
						.map(p -> transformProjectDbResReq(p)).collect(Collectors.toList());
				allProjects.put("ownedProjects", ownedProjectsReqRes);

			} else {
				List<ProjectReqRes> ownedProjectsReqRes = null;
				allProjects.put("ownedProjects", ownedProjectsReqRes);
			}

			if (!memberOfProjects.isEmpty()) {
				List<ProjectReqRes> memberOfProjectsReqRes = memberOfProjects.get().stream()
						.map(p -> transformProjectDbResReq(p)).collect(Collectors.toList());
				allProjects.put("onlyMember", memberOfProjectsReqRes);
			} else {
				List<ProjectReqRes> memberOfProjectsReqRes = null;
				allProjects.put("onlyMember", memberOfProjectsReqRes);
			}

			return new ResponseEntity<>(allProjects, HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went worng on our side...", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@GetMapping("/myprojects/{projectId}")
	public ResponseEntity<?> getProjectById(@PathVariable Long projectId) {
		try {

			String projectRole = getUserCredentialsPerProject(projectId);
			if (projectRole == "owner" || projectRole == "member") {

				Project project = projectRepo.findById(projectId).get();
				ProjectReqRes projectResReq = transformProjectDbResReq(project);

				return new ResponseEntity<>(projectResReq, HttpStatus.OK);
			}

			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong...", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@DeleteMapping("/myprojects/{projectId}")
	public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Project project = projectRepo.findById(projectId).get();
			Boolean projectDeleted = false;

			for (Section section : project.getSections()) {
				Boolean sectionDeleted = false;

				for (Task task : section.getTasks()) {

					if (!projectDeleted) {
						projectRepo.delete(project);
						projectDeleted = true;
					}

					if (!sectionDeleted) {
						sectionRepo.delete(section);
						sectionDeleted = true;
					}
					taskRepo.delete(task);
				}

				// if no tasks delete section
				if (!sectionDeleted) {
					projectRepo.delete(project);
					projectDeleted = true;
					sectionRepo.delete(section);
				}
			}

			// if no sections delete project
			if (!projectDeleted) {
				projectRepo.delete(project);
			}

			return new ResponseEntity<>("Project " + project.getTitle() + " successfully deleted.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// add new member to project
	@PreAuthorize("hasRole('ROLE_USER')")
	@PostMapping("/myprojects/{projectId}/{username}")
	public ResponseEntity<?> addUserToProject(@PathVariable String username, @PathVariable Long projectId) {
		try {
			User userToAdd = userRepo.findByUsername(username).get();

			if (userRepo.isMemberOfProject(userToAdd.getId(), projectId)) {
				return new ResponseEntity<>("User is already member of this project", HttpStatus.OK);
			}

			Project projectToBeUpdated = projectRepo.findById(projectId).get();

			projectToBeUpdated.getMembers().add(userToAdd);

			projectRepo.save(projectToBeUpdated);

			return new ResponseEntity<>("User Added to Project Successfully", HttpStatus.ACCEPTED);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong...", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@GetMapping("/myprojects/{projectId}/projectteam")
	public ResponseEntity<?> getAllUsersOfProject(@PathVariable Long projectId) {
		try {
			String userProjectAuth = getUserCredentialsPerProject(projectId);
			if (userProjectAuth == "none") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Project project = projectRepo.findById(projectId).get();
			Map<String, Set<User>> projectOwnersAndMembers = new HashMap<>();

			projectOwnersAndMembers.put("projectOwners", project.getOwners());
			projectOwnersAndMembers.put("projectMembers", project.getMembers());

			return new ResponseEntity<>(projectOwnersAndMembers, HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	// add project member to owner
	@PreAuthorize("hasRole('ROLE_USER')")
	@PutMapping("/myprojects/{projectId}/{username}")
	public ResponseEntity<?> addProjectMemberToOwner(@PathVariable String username, @PathVariable Long projectId) {

		try {
			String requestor = getUserCredentialsPerProject(projectId);
			if (requestor == "none") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			User user = userRepo.findByUsername(username).get();
			Project project = projectRepo.findById(projectId).get();

			project.getOwners().add(user);
			project.getMembers().remove(user);

			projectRepo.save(project);

			return new ResponseEntity<>(username + " added to owners", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@PostMapping("/myprojects/{projectId}/addsection")
	public ResponseEntity<?> createNewSection(@RequestBody Section newSection, @PathVariable Long projectId) {
		try {

			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Section section = new Section();
			section.setTitle(newSection.getTitle());
			section.setOrderId(newSection.getOrderId());
			section.setTasks(new ArrayList<Task>());

			Project project = projectRepo.findById(projectId).get();

			project.getSections().add(section);

			sectionRepo.save(section);
			projectRepo.save(project);

			SectionResReq sectionResReq = new SectionResReq(section.getId().toString(), section.getTitle(),
					section.getDescription(), new ArrayList<String>());

			return new ResponseEntity<>(sectionResReq, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@PutMapping("/myprojects/{projectId}")
	public ResponseEntity<?> updateSection(@PathVariable Long projectId, @RequestBody SectionResReq sectionUpdates) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Section section = sectionRepo.findById(Long.parseLong(sectionUpdates.getId())).get();

			// update title
			String updatedTitle = sectionUpdates.getTitle();
			if (updatedTitle != null && section.getTitle() != updatedTitle) {
				section.setTitle(updatedTitle);
			}

			// update description
			String updatedDescription = sectionUpdates.getDescription();
			if (updatedDescription != null && section.getDescription() != updatedDescription) {
				section.setDescription(updatedDescription);
			}

			// update the order of tasks and section relation

			Long updateSectionId = Long.parseLong(sectionUpdates.getId());
			List<String> tasksOrder = sectionUpdates.getTasksIds();
			if (tasksOrder != null) {
				for (String taskId : tasksOrder) {
					Long sectionId = sectionRepo.findSectionByTaskId(Long.parseLong(taskId));
					Task task = taskRepo.findById(Long.parseLong(taskId)).get();

					// remove task from old section and add it to the new one
					if (sectionId != updateSectionId) {
						Section oldSection = sectionRepo.findById(sectionId).get();
						oldSection.getTasks().removeIf(t -> t.getId() == task.getId());
						sectionRepo.save(oldSection);
						section.getTasks().add(task);

					}
					Integer taskOrder = task.getOrderId();
					Integer updatedTaskOrder = tasksOrder.indexOf(taskId) + 1;
					if (taskOrder != updatedTaskOrder) {
						task.setOrderId(updatedTaskOrder);
						taskRepo.save(task);
					}
				}
			}
			sectionRepo.save(section);

			return new ResponseEntity<>(HttpStatus.ACCEPTED);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@DeleteMapping("/myprojects/{projectId}/{sectionId}")
	public ResponseEntity<?> deleteSection(@PathVariable Long projectId, @PathVariable Long sectionId) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Section section = sectionRepo.findById(sectionId).get();
			Boolean sectionDeleted = false;

			Project project = projectRepo.findById(projectId).get();
			project.getSections().remove(section);

			List<Section> sortedSectionsByOrderId = project.getSections().stream()
					.sorted(Comparator.comparing(Section::getOrderId)).collect(Collectors.toList());

			int i = 1;
			for (Section s : sortedSectionsByOrderId) {
				s.setOrderId(i);
				i++;
			}

			projectRepo.save(project);

			for (Task task : section.getTasks()) {

				if (!sectionDeleted) {
					sectionRepo.delete(section);
					sectionDeleted = true;
				}
				taskRepo.delete(task);
			}

			sectionRepo.delete(section);

			return new ResponseEntity<>("Section " + section.getTitle() + " was successfully deleted.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@PostMapping("/myprojects/{projectId}/{sectionId}/addtask")
	public ResponseEntity<?> addTask(@RequestBody Task newTask, @PathVariable Long projectId,
			@PathVariable Long sectionId) {

		try {

			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Task task = new Task();
			task.setTitle(newTask.getTitle());
			task.setCompleted(false);
			task.setOrderId(newTask.getOrderId());

			Section section = sectionRepo.findById(sectionId).get();
			List<Long> tasksIds = section.getTasks().stream().map(t -> t.getId()).collect(Collectors.toList());
			for (Long tId : tasksIds) {
				Task t = taskRepo.findById(tId).get();
				Integer taskOrderId = t.getOrderId();
				t.setOrderId(taskOrderId + 1);
				taskRepo.save(t);
			}

			taskRepo.save(task);

			section.getTasks().add(task);

			sectionRepo.save(section);

			return new ResponseEntity<>(task, HttpStatus.CREATED);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@DeleteMapping("/myprojects/{projectId}/{sectionId}/{taskId}")
	public ResponseEntity<?> deleteTask(@PathVariable Long projectId, @PathVariable Long sectionId,
			@PathVariable Long taskId) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Section section = sectionRepo.findById(sectionId).get();
			Task task = taskRepo.findById(taskId).get();

			Integer taskOrderId = task.getOrderId();

			List<Long> tasksIdsToBeUpdated = section.getTasks().stream().filter(t -> t.getOrderId() > taskOrderId)
					.map(t -> t.getId()).collect(Collectors.toList());

			for (Long tId : tasksIdsToBeUpdated) {
				Task taskToBeUpdated = taskRepo.findById(tId).get();
				taskToBeUpdated.setOrderId(taskToBeUpdated.getOrderId() - 1);
				taskRepo.save(taskToBeUpdated);
			}

			section.getTasks().removeIf(t -> t.getId() == taskId);

			sectionRepo.save(section);
			taskRepo.delete(task);

			return new ResponseEntity<>("Task " + task.getTitle() + " was successfully deleted", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@PutMapping("/myprojects/taskDueDate")
	public ResponseEntity<?> updateTaskDueDate(@RequestParam Long projectId, @RequestParam(name = "taskId") Long taskId,
			@RequestParam(name = "dueDate", required = false) Long dueDate) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			
			Task task = taskRepo.findById(taskId).get();
			Date updateDueDate = dueDate != null ? new Date(dueDate) : null;
			if (task.getDueDate() != updateDueDate) {
				task.setDueDate(updateDueDate);
				taskRepo.save(task);
				return new ResponseEntity<>("Due date updated successfully to " + updateDueDate, HttpStatus.ACCEPTED);
			}
			
			return new ResponseEntity<>("Same due date, update not needed", HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@PutMapping("/myprojects/taskAssignUser")
	public ResponseEntity<?> updateTaskAssignUser(@RequestParam Long projectId, @RequestParam(name = "taskId") Long taskId,
			@RequestParam(name = "userId", required = false) Long userId) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			
			Task task = taskRepo.findById(taskId).get();
			User newUser = userRepo.findById(userId).orElse(null);
			
			if (newUser != task.getAssignedUser()) {
				task.setAssignedUser(newUser);
				taskRepo.save(task);
				return new ResponseEntity<>(
						newUser == null ? "Assignee removed from task" : "Task is assigned successfully to " + newUser.getUsername(),
								HttpStatus.ACCEPTED);
			}
			
			return new ResponseEntity<>("Same user, update not needed", HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PreAuthorize("hasRole('ROLE_USER')")
	@PutMapping("/myprojects/{projectId}/{sectionId}/updatetask")
	public ResponseEntity<?> updateTask(@RequestBody TaskUpdateRequest taskUpdates, @PathVariable Long projectId,
			@PathVariable Long sectionId) {
		try {
			if (getUserCredentialsPerProject(projectId) != "owner") {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}

			Task task = taskRepo.findById(taskUpdates.getId()).get();
			Boolean completed = taskUpdates.getCompleted();
			if (completed != null && task.getCompleted() != completed) {
				task.setCompleted(completed);
			}

			Long assigningUserId = taskUpdates.getAssignedUserId();
			if (assigningUserId != null) {

				User assignedUser = userRepo.findById(assigningUserId).get();
				if (assignedUser.getId() != task.getAssignedUser().getId()) {
					task.setAssignedUser(assignedUser);
				}
			}
			
			// MOVED TO updateTaskDueDate route
//			Long dueDate = taskUpdates.getDueDate();
//			if (dueDate != null) {
//				task.setDueDate(new Date(dueDate));
//			}
//
//			if (task.getDueDate() != null && dueDate == null) {
//				task.setDueDate(null);
//			}

			String title = taskUpdates.getTitle();
			if (title != null) {
				task.setTitle(title);
			}

			String attachment = taskUpdates.getAttachmentLocation();
			if (attachment != null) {
				task.setAttachmentLocation(attachment);
			}
			
			String taskDescription = taskUpdates.getDescription();
			if (taskDescription != null) {
				task.setDescription(taskDescription);
			}

			taskRepo.save(task);

			return new ResponseEntity<>(task, HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	private String getUserCredentialsPerProject(Long projectId) {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = userDetails.getUsername();
		Optional<User> requester = userRepo.findByUsername(username);

		if (userRepo.isOwnerOfProject(requester.get().getId(), projectId))
			return "owner";

		if (userRepo.isMemberOfProject(requester.get().getId(), projectId))
			return "member";

		return "none";

	}

	private ProjectReqRes transformProjectDbResReq(Project project) {
		ProjectReqRes projectResReq = new ProjectReqRes();

		projectResReq.setId(Long.toString(project.getId()));
		projectResReq.setTitle(project.getTitle());
		projectResReq.setDescription(project.getDescription());

		projectResReq.setOwners(project.getOwners());
		projectResReq.setMembers(project.getMembers());

		List<Section> sectionsDb = project.getSections();

		sectionsDb.sort(Comparator.comparing(Section::getOrderId));

		List<SectionResReq> sections = new ArrayList<>();
		List<String> sectionsOrder = new ArrayList<>();
		Map<String, SectionResReq> sectionsRes = new HashMap<>();
		Map<String, Task> tasksRes = new HashMap<>();

		for (Section section : sectionsDb) {
			SectionResReq sectionReqRes = new SectionResReq();
			sectionReqRes.setId(Long.toString(section.getId()));
			sectionReqRes.setTitle(section.getTitle());
			sectionReqRes.setDescription(section.getDescription());
			sectionsOrder.add(Long.toString(section.getId()));

			List<String> tasksIds = new ArrayList<>();
			List<Task> tasksDb = section.getTasks();
			tasksDb.sort(Comparator.comparing(Task::getOrderId));

			for (Task task : tasksDb) {
				tasksIds.add(Long.toString(task.getId()));
				tasksRes.put(Long.toString(task.getId()), task);
			}

			sectionReqRes.setTasksIds(tasksIds);
			sectionsRes.put(sectionReqRes.getId(), sectionReqRes);
		}

		projectResReq.setSections(sectionsRes);
		projectResReq.setTasks(tasksRes);
		projectResReq.setSectionsOrder(sectionsOrder);

		return projectResReq;
	}

}
