package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Integer> {
  Page<Product> findProductsByCategory_Id(Integer categoryId, Pageable pageable);
  }