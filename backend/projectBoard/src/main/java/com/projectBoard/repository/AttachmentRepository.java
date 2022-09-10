package com.projectBoard.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.projectBoard.entity.Attachment;
import com.projectBoard.entity.Task;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
	@Query(value = "SELECT * FROM attachment WHERE task_id = :taskId", nativeQuery = true)
	Set<Attachment> findAllByTask(Long taskId);
}
