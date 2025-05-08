package com.system.shoesstore.services.user;

import com.system.shoesstore.dtos.OrderDto;
import com.system.shoesstore.dtos.OrderdetailDto;
import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.entities.*;
import com.system.shoesstore.models.customer.OrderModel;
import com.system.shoesstore.repositories.*;
import com.system.shoesstore.utils.DTOMapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShippingaddressRepository shippingaddressRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DTOMapperUtil dtoMapper;

    @Autowired
    private CartdetailRepository cartdetailRepository;
    @Autowired
    private OrderdetailRepository orderdetailRepository;


    //Lấy tất cả theo useranem
    public Response getOrderByUsername(String username) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            List<Order> orders = orderRepository.findOrderByUserOrderByCreatedAtDesc(user);
            List<OrderDto> dtos = orders
                    .stream()
                    .map(dtoMapper::convertToOrderDto)
                    .collect(Collectors.toList());
            return new Response(HttpStatus.OK.value(), "Lấy danh sách  thành công.", dtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy danh sách : " + e.getMessage(),
                    null);
        }
    }

    //    Lấy theo trạng thái đơn hàng(được admin xác nhận/status)
    public Response getOrderByUserNameAndStatus(String status, String username) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            List<Order> orders = orderRepository.findOrderByStatusAndUserOrderByCreatedAtDesc(status, user);
            List<OrderDto> dtos = orders
                    .stream()
                    .map(dtoMapper::convertToOrderDto)
                    .collect(Collectors.toList());
            return new Response(HttpStatus.OK.value(), "Lấy danh sách  thành công.", dtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy danh sách : " + e.getMessage(),
                    null);
        }
    }//    Lấy theo trạng thái đơn hàng(được admin xác nhận/status)

    public Response getOrderByUserNameAndPaymentStatus(String paymentStatus, String username) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            List<Order> orders = orderRepository.findOrderByPaymentStatusAndUserOrderByCreatedAtDesc(paymentStatus, user);
            List<OrderDto> dtos = orders
                    .stream()
                    .map(dtoMapper::convertToOrderDto)
                    .collect(Collectors.toList());
            return new Response(HttpStatus.OK.value(), "Lấy danh sách  thành công.", dtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy danh sách : " + e.getMessage(),
                    null);
        }
    }

    public Response createOrder(OrderModel model) {
        try {
            User user = userRepository.findByUsername(model.getUsername())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + model.getUsername()));
            Shippingaddress shippingAddress = shippingaddressRepository.findById(model.getShippingAddressId())
                    .orElseThrow(() -> new RuntimeException("Không tìm tấy địa chỉ giao hanàng: " + model.getShippingAddressId()));
            Set<Cart> carts = user.getCarts();
            Cart cart = carts.iterator().next();
            if (cart == null || cart.getCartdetails().isEmpty()) {
                return new Response(HttpStatus.BAD_REQUEST.value(), "Giỏ hàng đang trống!", null);
            }

            Order order = new Order();
            order.setUser(user);
            order.setShippingAddress(shippingAddress);
            order.setCreatedAt(Instant.now());
            order.setPaymentMethod(model.getPaymentMethod());
            order.setStatus("Chờ xử lý");
            order.setPaymentStatus("Chờ thanh toán");
            double totalPrice = 0.0;
            for (Cartdetail cartDetail : cart.getCartdetails()) {
                Orderdetail orderDetail = new Orderdetail();
                orderDetail.setOrder(order);
                orderDetail.setProductDetail(cartDetail.getProductDetail());
                orderDetail.setQuantity(cartDetail.getQuantity());
                orderDetail.setPrice(cartDetail.getPrice());
                Productdetail productdetail = orderDetail.getProductDetail();
                orderDetail.getProductDetail().setStock(productdetail.getStock() - orderDetail.getQuantity());
                totalPrice += cartDetail.getQuantity() * cartDetail.getPrice();
                order.getOrderdetails().add(orderDetail);
            }
            order.setTotalPrice(totalPrice);
            order.setShippingFee(model.getShippingFee());
            order.setShippingTime(model.getShippingTime());
            Order savedOrder = orderRepository.save(order);
            orderdetailRepository.saveAll(order.getOrderdetails());
            OrderDto orderDto = dtoMapper.convertToOrderDto(savedOrder);
            List<Cartdetail> cartDetail = cartdetailRepository.findByCart(cart);
            cartdetailRepository.deleteAll(cartDetail);
            return new Response(HttpStatus.OK.value(), "Thành công!", orderDto);
        } catch (RuntimeException e) {
            return new Response(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }
public Response updateOrderStatus2(Long orderId, String status){
        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isPresent()) {
                System.out.println("Order found: " + orderOpt.get());
            } else {
                System.out.println("Order not found with ID: " + orderId);
            }
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus(status);
                orderRepository.save(order);
                return new Response(HttpStatus.OK.value(), "Cập nhật đơn hàng thành công!", dtoMapper.convertToOrderDto(order));
            } else {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy đơn hàng", null);
            }
        } catch (RuntimeException e) {
            return new Response(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }
    public Response updateOrderStatus(Long orderId, String status) {

        try {
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isPresent()) {
                System.out.println("Order found: " + orderOpt.get());
            } else {
                System.out.println("Order not found with ID: " + orderId);
            }
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                switch (status) {
                    case "PAID":
                        order.setPaymentStatus("Đã thanh toán");
                        order.setStatus("Đã xác nhận");
                        break;
                    case "PAYMENT_FAILED":
                        order.setPaymentStatus("Thanh toán thất bại");
                        order.setStatus("Chờ xử lý");
                        break;
                    case "PENDING_PAYMENT":
                        System.out.println("pending_payment");
                        order.setPaymentStatus("Chờ thanh toán");
                        order.setStatus("Chờ xử lý");
                        break;
                    default:
                        return new Response(HttpStatus.BAD_REQUEST.value(), "Trạng thái không hợp lệ", null);
                }
                orderRepository.save(order);
                return new Response(HttpStatus.OK.value(), "Cập nhật đơn hàng thành công!", dtoMapper.convertToOrderDto(order));
            } else {
                return new Response(HttpStatus.NOT_FOUND.value(), "Không tìm thấy đơn hàng", null);
            }
        } catch (RuntimeException e) {
            return new Response(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null);
        }
    }

    public Response getOrderById(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId).get();
            OrderDto orderDto = dtoMapper.convertToOrderDto(order);
            return new Response(HttpStatus.OK.value(), "Lấy danh sách  thành công.", orderDto);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy đơn hàng : " + e.getMessage(),
                    null);
        }
    }

    public Response cancelOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId).get();
            order.setStatus("Đã hủy");
            orderRepository.save(order);
            OrderDto orderDto = dtoMapper.convertToOrderDto(order);
            return new Response(HttpStatus.OK.value(), "Hủy đơn hàng thành công.", orderDto);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy đơn hàng : " + e.getMessage(),
                    null);
        }
    }
}
