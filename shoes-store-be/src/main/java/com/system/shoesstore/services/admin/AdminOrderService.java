package com.system.shoesstore.services.admin;

import com.system.shoesstore.dtos.OrderDto;
import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.entities.Order;
import com.system.shoesstore.entities.Ordertracking;
import com.system.shoesstore.repositories.OrderRepository;
import com.system.shoesstore.services.system.EmailService;
import com.system.shoesstore.utils.DTOMapperUtil;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    @Autowired
    private DTOMapperUtil dtoMapper;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    public Response getAllOrder(String phone, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orderPage;

            if (phone != null && !phone.trim().isEmpty()) {
                orderPage = orderRepository.findByShippingAddress_PhoneOrderByCreatedAtDesc(phone, pageable);
            } else {
                orderPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
            }

            List<OrderDto> dtos = orderPage.getContent()
                    .stream()
                    .map(dtoMapper::convertToOrderDto)
                    .collect(Collectors.toList());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("orders", dtos);
            responseData.put("currentPage", orderPage.getNumber());
            responseData.put("totalItems", orderPage.getTotalElements());
            responseData.put("totalPages", orderPage.getTotalPages());

            return new Response(HttpStatus.OK.value(), "Lấy danh sách đơn hàng thành công", responseData);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi khi lấy đơn hàng: " + e.getMessage(),
                    null);
        }
    }

    public Response getAllOrderByStatus(String status, String phone, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orderPage;

            boolean hasStatus = status != null && !status.trim().isEmpty();
            boolean hasPhone = phone != null && !phone.trim().isEmpty();

            if (hasStatus && hasPhone) {
                orderPage = orderRepository.findByStatusAndShippingAddress_PhoneOrderByCreatedAtDesc(status, phone, pageable);
            } else if (hasStatus) {
                orderPage = orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
            } else if (hasPhone) {
                orderPage = orderRepository.findByShippingAddress_PhoneOrderByCreatedAtDesc(phone, pageable);
            } else {
                orderPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
            }

            List<OrderDto> dtos = orderPage.getContent()
                    .stream()
                    .map(dtoMapper::convertToOrderDto)
                    .collect(Collectors.toList());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("orders", dtos);
            responseData.put("currentPage", orderPage.getNumber());
            responseData.put("totalItems", orderPage.getTotalElements());
            responseData.put("totalPages", orderPage.getTotalPages());

            return new Response(HttpStatus.OK.value(), "Lấy danh sách đơn hàng thành công", responseData);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi khi lấy đơn hàng: " + e.getMessage(),
                    null);
        }
    }

    public Response acceptOrder(Long orderId, String status) {
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() ->
                    new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
            order.setStatus(status);
            orderRepository.save(order);
            OrderDto orderDto = dtoMapper.convertToOrderDto(order);
//            String emailContent = emailService.buildGiftCardEmail(orderDto);
//            emailService.sendHtmlEmail(orderDto.getUser().getEmail(),
//                    "Đơn hàng #" + order.getId() + " đã được chấp nhận!",
//                    emailContent);
            return new Response(HttpStatus.OK.value(),
                    "Đơn hàng đã cập nhật.",
                    orderDto);
        } catch (Exception e) {
            System.out.println("e" + e);
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi xử lý đơn hàng: " + e.getMessage(), null);
        }
    }

    public Response updateOrderTrackingStatus(Long orderId, String status) {
        try {
            Order order = orderRepository.findById(orderId).get();
            Ordertracking orderTracking = new Ordertracking();
            orderTracking.setStatus(status);
            orderTracking.setUpdatedAt(Instant.now());
            orderTracking.setOrder(order);
            return new Response(HttpStatus.OK.value(), "Cập nhật đơn hàng thành công!",
                    dtoMapper.convertToOrdertrackingDto(orderTracking));
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Cập nhật đơn hàng thất bại: " + e.getMessage(),
                    null);
        }
    }

    public Response getCountByStatus() {
        try {
            long count = orderRepository.countAllByStatus("Chờ xử lý");
            return new Response(HttpStatus.OK.value(), "Bạn có đơn hàng mới!", count);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Cập nhật đơn hàng thất bại: " + e.getMessage(),
                    null);
        }
    }
}
