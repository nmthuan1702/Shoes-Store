package com.system.shoesstore.controllers.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.services.user.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/history")
public class HistoryOrderController {
    @Autowired
    private OrderService orderService;

    //tất cả
    @GetMapping("/u")
    public ResponseEntity<Response> getAllOrderByUsername(@RequestParam String username) {
        try {
            Response response = orderService.getOrderByUsername(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách: " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/s")
    public ResponseEntity<Response> getOrderByStatus(@RequestParam String username, @RequestParam String status) {
        try {
            Response response = orderService.getOrderByUserNameAndStatus(status, username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách: " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/p")
    public ResponseEntity<Response> getOrderByPaymentStatus(@RequestParam String username, @RequestParam String paymentStatus) {
        try {
            Response response = orderService.getOrderByUserNameAndPaymentStatus(paymentStatus, username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách: " + e.getMessage(),
                            null));
        }
    }

    //    Hủy đơn hàng
    @PutMapping("/cancel")
    public ResponseEntity<Response> cancelOrder(@RequestParam Long orderId) {
        try {
            Response response = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách: " + e.getMessage(),
                            null));
        }
    }
}
