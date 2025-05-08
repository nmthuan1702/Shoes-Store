package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdertrackingDto implements Serializable {
    Integer id;
    OrderDto order;
    String status;
    String updatedAt;
}