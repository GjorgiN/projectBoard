package com.projectBoard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.projectBoard.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query(value = "SELECT * FROM projects_owners JOIN project ON projects_owners.project_id = project.id WHERE projects_owners.user_id= :userId", nativeQuery = true)
	Optional<List<Project>> findAllByOwnerId(@Param("userId") Long userId);

	@Query(value = "SELECT * FROM projects_members JOIN project ON projects_members.project_id = project.id WHERE projects_members.user_id = :userId", nativeQuery = true)
	Optional<List<Project>> findAllIfUserIsMemberByUserId(@Param("userId") Long userId);

}
