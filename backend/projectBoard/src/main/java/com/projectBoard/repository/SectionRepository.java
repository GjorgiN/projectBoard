package com.projectBoard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.projectBoard.entity.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long>{
	
	@Query(value = "SELECT section_id FROM section_tasks WHERE tasks_id = :taskId", nativeQuery = true)
	Long findSectionByTaskId(@Param("taskId") Long taskId);
}
