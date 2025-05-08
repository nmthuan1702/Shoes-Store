package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto implements Serializable {
    Integer id;
    String name;
    String description;
    CategoryDto category;
    BrandDto brand;
    String createdAt;
    Double price;
    private String fomatPrice;
    List<ProductdetailDto> productDetails;
}