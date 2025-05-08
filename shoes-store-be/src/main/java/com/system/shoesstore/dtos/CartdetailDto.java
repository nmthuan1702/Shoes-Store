package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartdetailDto implements Serializable {
    Integer id;
    ProductdetailDto productDetail;
    Integer quantity;
    Double price;
    private String formattedPrice;
    private String productName;
    private String productDescription;
    private String totalPrice;
}