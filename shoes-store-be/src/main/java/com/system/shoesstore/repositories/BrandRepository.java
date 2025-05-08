package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
  }