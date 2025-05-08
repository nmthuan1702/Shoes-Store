package com.system.shoesstore.controllers.admin;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.services.admin.AdminOrderService;
import com.system.shoesstore.services.user.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/admin/order")
public class AdminOrderController {
    @Autowired
    private AdminOrderService adminOrderService;
    @Autowired
    private OrderService orderService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllOrder(
            @RequestParam(defaultValue = "") String phone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminOrderService.getAllOrder(phone, page, size));
    }

    @GetMapping("/status")
    public ResponseEntity<Response> getAllOrderByStatus(@RequestParam String status,
                                                        @RequestParam(defaultValue = "") String phone,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminOrderService.getAllOrderByStatus(status, phone, page, size));
    }

    @GetMapping("/detail")
    public ResponseEntity<Response> getOrderById(@RequestParam Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PutMapping("")
    public ResponseEntity<Response> updateOrder(@RequestParam Long orderId, @RequestParam String status) {
        try {
            Response response = adminOrderService.acceptOrder(orderId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }
    @PutMapping("/trackingOrder")
    public ResponseEntity<Response> updateTrackingOrder(@RequestParam Long orderId, @RequestParam String status) {
        try {
            Response response = adminOrderService.updateOrderTrackingStatus(orderId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }
    @GetMapping("/new-count")
    public ResponseEntity<?> getNewOrderCount() {
        try {
            Response response = adminOrderService.getCountByStatus();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

}
