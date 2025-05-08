package com.system.shoesstore.services.user;

import com.system.shoesstore.dtos.*;
import com.system.shoesstore.entities.*;
import com.system.shoesstore.models.customer.CartModel;
import com.system.shoesstore.repositories.*;
import com.system.shoesstore.utils.DTOMapperUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class ShoppingCartService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductdetailRepository productdetailRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartdetailRepository cartDetailRepository;

    @Autowired
    private DTOMapperUtil dtoMapper;

    public Response getShoppingCart(String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
            Cart cart = cartRepository.findCartByUser(user);
            if (cart == null) {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy giỏ hàng", null);
            }
            CartDto cartDto = dtoMapper.convertToCartDto(cart);
            return new Response(HttpStatus.OK.value(), "Lấy giỏ hàng thành công", cartDto);
        } catch (RuntimeException e) {
            return new Response(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    @Transactional
    public Response addToCart(CartModel model) {
        try {
            User user = userRepository.findByUsername(model.getUsername())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + model.getUsername()));
            Productdetail productDetail = productdetailRepository.findById(model.getProductDetailId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));
            if (productDetail.getStock() < model.getQuantity()) {
                return new Response(HttpStatus.BAD_REQUEST.value(), "Không đủ hàng trong kho", null);
            }
            Cart cart = cartRepository.findCartByUser(user);
            if (cart == null) {
                cart = new Cart();
                cart.setUser(user);
                cart.setCreatedAt(Instant.now());
                cartRepository.save(cart);
            }
            Optional<Cartdetail> existingDetail = cart.getCartdetails().stream()
                    .filter(detail -> detail.getProductDetail().getId().equals(model.getProductDetailId()))
                    .findFirst();

            if (existingDetail.isPresent()) {
                Cartdetail cartDetail = existingDetail.get();
                cartDetail.setQuantity(cartDetail.getQuantity() + model.getQuantity());
                cartDetailRepository.save(cartDetail);
            } else {
                Cartdetail cartDetail = new Cartdetail();
                cartDetail.setCart(cart);
                cartDetail.setProductDetail(productDetail);
                cartDetail.setQuantity(model.getQuantity());
                cartDetail.setPrice(productDetail.getProduct().getPrice());
                cartDetailRepository.save(cartDetail);
            }
            CartDto cartDto = dtoMapper.convertToCartDto(cart);
            return new Response(HttpStatus.OK.value(), "Thêm sản phẩm vào giỏ hàng thành công!", cartDto);
        } catch (RuntimeException e) {
            return new Response(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    @Transactional
    public Response updateQuantity(Integer cartDetailId, int newQuantity) {
        try {
            if (cartDetailId == null || newQuantity <= 0) {
                return new Response(HttpStatus.BAD_REQUEST.value(), "ID chi tiết giỏ hàng và số lượng phải hợp lệ", null);
            }
            Optional<Cartdetail> cartDetailOptional = cartDetailRepository.findById(cartDetailId);
            if (cartDetailOptional.isEmpty()) {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy chi tiết giỏ hàng", null);
            }
            Cartdetail cartDetail = cartDetailOptional.get();
            Productdetail productDetail = cartDetail.getProductDetail();
            if (newQuantity > productDetail.getStock()) {
                return new Response(HttpStatus.BAD_REQUEST.value(), "Không đủ hàng trong kho", null);
            }
            cartDetail.setQuantity(newQuantity);
            cartDetailRepository.save(cartDetail);
            CartDto cartDto = dtoMapper.convertToCartDto(cartDetail.getCart());
            return new Response(HttpStatus.OK.value(), "Cập nhật số lượng thành công", cartDto);
        } catch (RuntimeException e) {
            return new Response(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    @Transactional
    public Response removeFromCart(String username) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy người dùng", null);
            }
            Cart cart = cartRepository.findCartByUser(user);
            if (cart == null) {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy giỏ hàng", null);
            }
            for (Cartdetail detail : cart.getCartdetails()) {
                cartDetailRepository.delete(detail);
            }
            cartRepository.delete(cart);
            return new Response(HttpStatus.OK.value(), "Xóa toàn bộ giỏ hàng thành công", null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    @Transactional
    public Response removeCartItem(Integer cartDetailId) {
        try {
            if (cartDetailId == null) {
                return new Response(HttpStatus.BAD_REQUEST.value(), "ID chi tiết giỏ hàng không được để trống", null);
            }
            Optional<Cartdetail> cartDetailOptional = cartDetailRepository.findById(cartDetailId);
            if (cartDetailOptional.isEmpty()) {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy chi tiết giỏ hàng", null);
            }
            Cartdetail cartDetail = cartDetailOptional.get();
            Cart cart = cartDetail.getCart();
            cartDetailRepository.delete(cartDetail);
            CartDto cartDto = dtoMapper.convertToCartDto(cart);
            return new Response(HttpStatus.OK.value(), "Xóa sản phẩm khỏi giỏ hàng thành công", cartDto);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }



}
