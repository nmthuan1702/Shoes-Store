package com.system.shoesstore.utils;

import com.system.shoesstore.dtos.*;
import com.system.shoesstore.entities.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DTOMapperUtil {
    public UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setAddress(user.getAddress());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setCreatedAt(Utils.formatDateToVietnameseTime(user.getCreatedAt()));
        if (user.getRole() != null) {
            RoleDto roleDto = new RoleDto();
            roleDto.setId(user.getRole().getId());
            roleDto.setRoleName(user.getRole().getRoleName());
            userDto.setRole(roleDto);
        }
        return userDto;
    }

    public ProductDto convertToProductDto(Product product) {
        if (product == null) return null;
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setFomatPrice(Utils.formatCurrency(product.getPrice()));
        dto.setCreatedAt(Utils.formatDateToVietnameseTime(product.getCreatedAt()));

        if (product.getCategory() != null) {
            dto.setCategory(new CategoryDto(product.getCategory().getId(), product.getCategory().getName()));
        }

        if (product.getBrand() != null) {
            dto.setBrand(new BrandDto(product.getBrand().getId(), product.getBrand().getName()));
        }

        // Lấy danh sách chi tiết sản phẩm và thêm vào DTO
        List<ProductdetailDto> productDetails = product.getProductdetails().stream()
                .map(this::convertToProductDetailDto)
                .collect(Collectors.toList());
        dto.setProductDetails(productDetails);

        return dto;
    }

    public ProductdetailDto convertToProductDetailDto(Productdetail productdetail) {
        if (productdetail == null) return null;
        ProductdetailDto dto = new ProductdetailDto();
        dto.setId(productdetail.getId());
        dto.setName(productdetail.getProduct().getName());
        dto.setSize(productdetail.getSize());
        dto.setStatus(productdetail.getStatus());
        dto.setImageUrl(productdetail.getImageUrl());
        dto.setStock(productdetail.getStock());
        dto.setColor(productdetail.getColor());
        return dto;
    }

    public CartDto convertToCartDto(Cart cart) {
        if (cart == null) return null;
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setUser(convertToUserDto(cart.getUser()));
        String formattedCreatedAt = Utils.formatDateToVietnameseTime(cart.getCreatedAt());
        cartDto.setCreatedAt(formattedCreatedAt);
        List<CartdetailDto> cartDetailDtos = cart.getCartdetails().stream()
                .map(this::convertToCartDetailDto)
                .collect(Collectors.toList());
        cartDto.setCartdetails(cartDetailDtos);
        double totalAmount = cart.getCartdetails().stream()
                .mapToDouble(detail -> detail.getProductDetail().getProduct().getPrice() * detail.getQuantity())
                .sum();
        cartDto.setTotalAmount(totalAmount);
        cartDto.setFormatTotalAmount(Utils.formatCurrency(totalAmount));
        return cartDto;
    }

    public CartdetailDto convertToCartDetailDto(Cartdetail detail) {
        if (detail == null) return null;
        CartdetailDto detailDto = new CartdetailDto();
        detailDto.setId(detail.getId());
        detailDto.setQuantity(detail.getQuantity());
        detailDto.setPrice(detail.getProductDetail().getProduct().getPrice());
        detailDto.setFormattedPrice(Utils.formatCurrency(detail.getProductDetail().getProduct().getPrice()));
        detailDto.setProductName(detail.getProductDetail().getProduct().getName());
        detailDto.setProductDescription(detail.getProductDetail().getProduct().getDescription());
        detailDto.setTotalPrice(Utils.formatCurrency(detail.getProductDetail().getProduct().getPrice() * detail.getQuantity()));
        if (detail.getProductDetail() != null) {
            ProductdetailDto productDetailDto = convertToProductDetailDto(detail.getProductDetail());
            detailDto.setProductDetail(productDetailDto);
        }
        return detailDto;
    }

    public ShippingaddressDto convertToShippingAddress(Shippingaddress shippingAddress) {
        if (shippingAddress == null) return null;
        ShippingaddressDto shippingAddressDto = new ShippingaddressDto();
        shippingAddressDto.setId(shippingAddress.getId());
        if (shippingAddress.getUser() != null) {
            shippingAddressDto.setUser(convertToUserDto(shippingAddress.getUser()));
        }
        shippingAddressDto.setAddress(shippingAddress.getAddress());
        shippingAddressDto.setCity(shippingAddress.getCity());
        shippingAddressDto.setCountry(shippingAddress.getCountry());
        shippingAddressDto.setProvince(shippingAddress.getProvince());
        shippingAddressDto.setRecipientName(shippingAddress.getRecipientName());
        shippingAddressDto.setPhone(shippingAddress.getPhone());
        shippingAddressDto.setDefaultShippingAddress(shippingAddress.getIsDefault());
        shippingAddressDto.setProvince_id(shippingAddress.getProvinceId());
        shippingAddressDto.setDistrict_id(shippingAddress.getDistrictId());
        shippingAddressDto.setWard_code(shippingAddress.getWardCode());
        return shippingAddressDto;
    }

    public List<ShippingaddressDto> convertToShippingAddressList(List<Shippingaddress> shippingAddresses) {
        if (shippingAddresses == null || shippingAddresses.isEmpty()) {
            return List.of();
        }
        return shippingAddresses.stream()
                .map(this::convertToShippingAddress)
                .collect(Collectors.toList());
    }

    public OrderDto convertToOrderDto(Order order) {
        if (order == null) return null;

        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setUser(convertToUserDto(order.getUser()));
        orderDto.setTotalPrice(order.getTotalPrice());
        orderDto.setFormattedTotalPrice(Utils.formatCurrency(order.getTotalPrice()));
        orderDto.setStatus(order.getStatus());
        orderDto.setPaymentMethod(order.getPaymentMethod());
        orderDto.setPaymentStatus(order.getPaymentStatus());
        if (order.getTotalPrice() != null) {
            orderDto.setFormattedTotalPrice(Utils.formatCurrency(order.getTotalPrice()));
        }

        if (order.getShippingFee() != null) {
            orderDto.setFormatShippingFee(Utils.formatCurrency(order.getShippingFee()));
            orderDto.setTotalAmount(Utils.formatCurrency(order.getTotalPrice() + order.getShippingFee()));
        } else {
            orderDto.setTotalAmount(Utils.formatCurrency(order.getTotalPrice()));
        }
        orderDto.setCreatedAt(Utils.formatDateToVietnameseTime(order.getCreatedAt()));
        List<OrderdetailDto> orderDetailDtos = new ArrayList<>();
        if (order.getOrderdetails() != null) {
            for (Orderdetail detail : order.getOrderdetails()) {
                orderDetailDtos.add(convertToOrderdetailDto(detail));
            }
        }
        orderDto.setShippingTime(order.getShippingTime());
        orderDto.setShippingAddress(convertToShippingAddress(order.getShippingAddress()));
        orderDto.setOrderDetails(orderDetailDtos);

        return orderDto;
    }

    public OrdertrackingDto convertToOrdertrackingDto(Ordertracking orderTracking) {
        if (orderTracking == null) return null;
        OrdertrackingDto orderTrackingDto = new OrdertrackingDto();
        orderTrackingDto.setId(orderTracking.getId());
        orderTrackingDto.setOrder(convertToOrderDto(orderTracking.getOrder()));
        orderTrackingDto.setStatus(orderTracking.getStatus());
        orderTrackingDto.setUpdatedAt(Utils.formatDateToVietnameseTime(orderTracking.getUpdatedAt()));
        return orderTrackingDto;
    }

    public OrderdetailDto convertToOrderdetailDto(Orderdetail orderDetail) {
        OrderdetailDto orderDetailDto = new OrderdetailDto();
        orderDetailDto.setId(orderDetail.getId());
//        orderDetailDto.setOrder(convertToOrderDto(orderDetail.getOrder()));
        orderDetailDto.setProductDetail(convertToProductDetailDto(orderDetail.getProductDetail()));
        orderDetailDto.setQuantity(orderDetail.getQuantity());
        orderDetailDto.setPrice(orderDetail.getPrice());
        orderDetailDto.setFormatPrice(Utils.formatCurrency(orderDetail.getPrice()));
        return orderDetailDto;
    }

}
