package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Orderdetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderdetailRepository extends JpaRepository<Orderdetail, Integer> {
  }