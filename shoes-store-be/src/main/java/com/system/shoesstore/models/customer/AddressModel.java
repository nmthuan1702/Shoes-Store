package com.system.shoesstore.models.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressModel {
    String user;
    @NotBlank(message = "Tên người nhận không thể để trống")
    String recipientName;

    @NotBlank(message = "Số điện thoại không thể để trống")
    @Pattern(
            regexp = "^(0)[0-9]{9}$",
            message = "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại bắt đầu bằng 0 và đủ 10 số."
    )
    private String phone;

    @NotBlank(message = "Địa chỉ không thể để trống")
    String address;

    @NotBlank(message = "Thành phố không thể để trống")
    String city;

    @NotBlank(message = "Tỉnh/Thành phố không thể để trống")
    String province;

    @NotBlank(message = "Quốc gia không thể để trống")
    String country;

    Integer province_id;
    Integer district_id;
    String ward_code;
}
