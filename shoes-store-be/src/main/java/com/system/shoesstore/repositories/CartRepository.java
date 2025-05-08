package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Cart;
import com.system.shoesstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
  Cart findCartByUser(User username);
}