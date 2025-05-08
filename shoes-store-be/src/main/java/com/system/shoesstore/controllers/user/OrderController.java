package com.system.shoesstore.controllers.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.models.customer.OrderModel;
import com.system.shoesstore.services.user.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("")
    public ResponseEntity<Response> getOrderById(@RequestParam Long orderId) {
        try {
            Response response = orderService.getOrderById(orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

    @PostMapping("")
    public ResponseEntity<Response> createOrder(@RequestBody OrderModel model) {
        try {
            Response response = orderService.createOrder(model);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

    @PutMapping
    public ResponseEntity<Response> updateOrder(@RequestParam Long orderId, @RequestParam String status) {
        try {
            Response response = orderService.updateOrderStatus2(orderId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }
}
