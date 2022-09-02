package com.projectBoard.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.projectBoard.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);

	@Query(value = "SELECT EXISTS(SELECT 1 FROM projects_members WHERE user_id = :userId AND project_id = :projectId)", nativeQuery = true)
	Boolean isMemberOfProject(@Param("userId") Long userId, @Param("projectId") Long projectId);

	@Query(value = "SELECT EXISTS(SELECT 1 FROM projects_owners WHERE user_id = :userId AND project_id = :projectId)", nativeQuery = true)
	Boolean isOwnerOfProject(@Param("userId") Long userId, @Param("projectId") Long projectId);

	@Query(value = "SELECT * FROM \"user\" WHERE username LIKE %:username%", nativeQuery = true)
	Set<User> searchUserByUsername(@Param("username") String username);

	@Query(value = "SELECT * FROM \"user\" WHERE username LIKE %:searchQuery% OR email LIKE %:searchQuery% OR first_name LIKE %:searchQuery% "
			+ "OR last_name LIKE %:searchQuery%", nativeQuery = true)
	Set<User> findBySearchQuery(@Param("searchQuery") String searchQuery);

}
