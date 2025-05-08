package com.system.shoesstore.models.manager;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
@Data
public class ProductModel {
    String name;
    String description;
    BigDecimal price;
    Integer size;
    Integer stock;
    int categoryId;
    String imageUrl;
    Instant createdAt;
    int brandId;
}
