package com.system.shoesstore.repositories;

import com.system.shoesstore.entities.Shippingaddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShippingaddressRepository extends JpaRepository<Shippingaddress, Integer> {
    @Query("SELECT sa FROM Shippingaddress sa WHERE sa.user.username = :username AND sa.isDefault = true ORDER BY sa.id DESC")
    List<Shippingaddress> findActiveAddressesByUsername(@Param("username") String username);

}