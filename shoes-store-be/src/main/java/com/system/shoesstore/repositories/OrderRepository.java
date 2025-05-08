package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Order;
import com.system.shoesstore.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findOrderByUserOrderByCreatedAtDesc(User username);

    List<Order> findOrderByStatusAndUserOrderByCreatedAtDesc(String status, User user);

    List<Order> findOrderByPaymentStatusAndUserOrderByCreatedAtDesc(String status, User user);

    Page<Order> findByStatusAndShippingAddress_PhoneOrderByCreatedAtDesc(String status, String phone, Pageable pageable);

    Page<Order> findByShippingAddress_PhoneOrderByCreatedAtDesc(String phone, Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countAllByStatus(String status);
}