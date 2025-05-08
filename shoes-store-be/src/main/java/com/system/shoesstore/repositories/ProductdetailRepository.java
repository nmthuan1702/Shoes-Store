package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Productdetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductdetailRepository extends JpaRepository<Productdetail, Integer> {
    List<Productdetail> findByProductId(Integer productId);
}