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
public class UserDto implements Serializable {
    Integer id;
    String username;
    String email;
    String phone;
    String address;
    String createdAt;
    RoleDto role;
}