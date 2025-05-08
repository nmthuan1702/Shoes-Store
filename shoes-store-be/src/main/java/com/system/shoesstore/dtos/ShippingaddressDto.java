package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingaddressDto implements Serializable {
    Integer id;
    UserDto user;
    String recipientName;
    String phone;
    String address;
    String city;
    String province;
    String country;
    Boolean defaultShippingAddress;
    Integer province_id;
    Integer district_id;
    String ward_code;
}