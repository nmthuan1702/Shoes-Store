package com.system.shoesstore.models.customer;

import com.system.shoesstore.dtos.ShippingaddressDto;
import com.system.shoesstore.dtos.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderModel {
    String username;
    Integer shippingAddressId;
    Double totalPrice;
    String status;
    String paymentMethod;
    String paymentStatus;
    Instant createdAt;
    Double shippingFee;
    String shippingTime;
}
