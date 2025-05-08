package com.system.shoesstore.models.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartModel {
    String username;
    Integer productDetailId;
    int quantity;
}
