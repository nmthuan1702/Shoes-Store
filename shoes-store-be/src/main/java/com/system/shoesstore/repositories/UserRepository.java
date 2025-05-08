package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
  boolean existsByUsername(String username);
  Optional<User> findByUsername(String username);
  boolean existsByEmail(String email);

}