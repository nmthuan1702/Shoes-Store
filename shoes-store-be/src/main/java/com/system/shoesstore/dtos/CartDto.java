package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDto implements Serializable {
    Integer id;
    UserDto user;
    String createdAt;
    private List<CartdetailDto> cartdetails;
    private String formatTotalAmount;
    private Double totalAmount;
}