package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductdetailDto implements Serializable {
    Integer id;
    Integer size;
    String color;
    String name;
    Integer stock;
    String imageUrl;
    Boolean status;
}