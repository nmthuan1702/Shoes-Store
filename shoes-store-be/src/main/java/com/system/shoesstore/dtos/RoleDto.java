package com.system.shoesstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDto implements Serializable {
    Integer id;
    String roleName;
}