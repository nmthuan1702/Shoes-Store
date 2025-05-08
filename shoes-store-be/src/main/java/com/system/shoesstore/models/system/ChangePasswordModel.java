package com.system.shoesstore.models.system;

import lombok.Data;

@Data
public class ChangePasswordModel {
    String username;
    String oldPassword;
    String newPassword;
}
