package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderdetailDto implements Serializable {
    Integer id;
    OrderDto order;
    ProductdetailDto productDetail;
    Integer quantity;
    Double price;
    private String formatPrice;
}