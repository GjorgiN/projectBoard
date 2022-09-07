package com.projectBoard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projectBoard.entity.Attachment;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

}
