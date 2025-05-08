package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Ordertracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdertrackingRepository extends JpaRepository<Ordertracking, Integer> {
    List<Ordertracking> findByOrderId(Long orderId);
}