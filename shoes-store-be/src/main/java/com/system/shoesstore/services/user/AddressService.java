package com.system.shoesstore.services.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.dtos.ShippingaddressDto;
import com.system.shoesstore.entities.Shippingaddress;
import com.system.shoesstore.entities.User;
import com.system.shoesstore.models.customer.AddressModel;
import com.system.shoesstore.repositories.ShippingaddressRepository;
import com.system.shoesstore.repositories.UserRepository;
import com.system.shoesstore.utils.DTOMapperUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

import java.util.List;
import java.util.Set;

@Service
public class AddressService {
    @Autowired
    private ShippingaddressRepository shippingaddressRepository;
    @Autowired
    private DTOMapperUtil dtoMapper;
    @Autowired
    private UserRepository userRepository;

    public Response getAddressByUsername(String username) {
        List<Shippingaddress> shippingAddress =
                shippingaddressRepository.findActiveAddressesByUsername(username);
        try {
            if (shippingAddress == null) {
                return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Không có địa chỉ", null);
            }
            List<ShippingaddressDto> dto = dtoMapper.convertToShippingAddressList(shippingAddress);
            return new Response(HttpStatus.OK.value(), "Lấy địa chỉ thành công: ", dto);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    @Transactional
    public Response addAddress(AddressModel model) {
        User u = userRepository.findByUsername(model.getUser()).orElse(null);
        if (u == null) {
            return new Response(HttpStatus.UNAUTHORIZED.value(), "Vui lòng đăng nhập!", null);
        }
        if (model.getRecipientName().isEmpty() || model.getPhone().isEmpty() || model.getAddress().isEmpty() || model.getCity().isEmpty() || model.getProvince().isEmpty() || model.getCountry().isEmpty()) {
            return new Response(HttpStatus.BAD_REQUEST.value(), "Vui lòng điền đầy đủ thông tin địa chỉ", null);
        }
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<AddressModel>> violations = validator.validate(model);
        if (!violations.isEmpty()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ConstraintViolation<AddressModel> violation : violations) {
                errorMessages.append(violation.getMessage()).append(" ");
            }
            return new Response(HttpStatus.BAD_REQUEST.value(), errorMessages.toString(), null);
        }
        try {
            Shippingaddress shippingAddress = new Shippingaddress();
            shippingAddress.setUser(u);
            shippingAddress.setAddress(model.getAddress());
            shippingAddress.setCity(model.getCity());
            shippingAddress.setProvince(model.getProvince());
            shippingAddress.setCountry(model.getCountry());
            shippingAddress.setPhone(model.getPhone());
            shippingAddress.setRecipientName(model.getRecipientName());
            shippingAddress.setIsDefault(true);
            shippingAddress.setDistrictId(model.getDistrict_id());
            shippingAddress.setProvinceId(model.getProvince_id());
            shippingAddress.setWardCode(model.getWard_code());
            shippingaddressRepository.save(shippingAddress);
            return new Response(HttpStatus.OK.value(), "Thêm địa chỉ mới thành công", dtoMapper.convertToShippingAddress(shippingAddress));

        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    @Transactional
    public Response updateAddress(Integer shippingAddressId, AddressModel model) {
        User u = userRepository.findByUsername(model.getUser()).orElse(null);
        Shippingaddress shippingAddress = shippingaddressRepository.findById(shippingAddressId).orElse(null);
        if (u == null) {
            return new Response(HttpStatus.UNAUTHORIZED.value(), "Vui lòng đăng nhập!", null);
        }
        if (model.getRecipientName().isEmpty() || model.getPhone().isEmpty() || model.getAddress().isEmpty() || model.getCity().isEmpty() || model.getProvince().isEmpty() || model.getCountry().isEmpty()) {
            return new Response(HttpStatus.BAD_REQUEST.value(), "Vui lòng điền đầy đủ thông tin địa chỉ", null);
        }
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<AddressModel>> violations = validator.validate(model);
        if (!violations.isEmpty()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ConstraintViolation<AddressModel> violation : violations) {
                errorMessages.append(violation.getMessage()).append(" ");
            }
            return new Response(HttpStatus.BAD_REQUEST.value(), errorMessages.toString(), null);
        }
        try {
            shippingAddress.setAddress(model.getAddress());
            shippingAddress.setCity(model.getCity());
            shippingAddress.setProvince(model.getProvince());
            shippingAddress.setCountry(model.getCountry());
            shippingAddress.setPhone(model.getPhone());
            shippingAddress.setRecipientName(model.getRecipientName());
            shippingaddressRepository.save(shippingAddress);
            return new Response(HttpStatus.OK.value(), "Cập nhật địa chỉ thành công", dtoMapper.convertToShippingAddress(shippingAddress));
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    public Response removerAddress(Integer shippingAddressId) {
        Shippingaddress shippingAddress = shippingaddressRepository.findById(shippingAddressId).orElse(null);
        try {
            if (shippingAddress == null) {
                return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Không có địa chỉ", null);
            }
            shippingAddress.setIsDefault(false);
            shippingaddressRepository.save(shippingAddress);
            return new Response(HttpStatus.OK.value(), "Xóa địa chỉ thành công!", dtoMapper.convertToShippingAddress(shippingAddress));
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }
}
