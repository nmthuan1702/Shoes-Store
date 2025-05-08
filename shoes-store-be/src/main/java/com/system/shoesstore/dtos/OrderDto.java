package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto implements Serializable {
    Long id;
    UserDto user;
    ShippingaddressDto shippingAddress;
    Double totalPrice;
    private String formattedTotalPrice;
    String status;
    String paymentMethod;
    String paymentStatus;
    String createdAt;
    Double shippingFee;
    String ShippingTime;
    private String formatShippingFee;
    private List<OrderdetailDto> orderDetails;
    String totalAmount;
}