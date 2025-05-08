package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Cart;
import com.system.shoesstore.entities.Cartdetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartdetailRepository extends JpaRepository<Cartdetail, Integer> {
    List<Cartdetail> findByCart(Cart cart);
}