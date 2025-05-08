package com.system.shoesstore.controllers.user;

import com.system.shoesstore.services.user.OrderService;
import com.system.shoesstore.services.user.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/payment")
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private OrderService orderService;

    @PostMapping("")
    public ResponseEntity<String> createPayment(@RequestBody Map<String, Object> body) {
        try {
            Integer amount = Integer.parseInt(body.get("amount").toString());
            String orderInfo = body.get("orderInfo").toString();
            Long orderId = Long.parseLong(body.get("orderId").toString());
            String paymentUrl = vnPayService.createPayment(amount, orderInfo, orderId);
            if (paymentUrl != null) {
                if (orderId != null) {
                    orderService.updateOrderStatus(orderId, "PENDING_PAYMENT");
                }
                return ResponseEntity.ok(paymentUrl);
            } else {
                return ResponseEntity.badRequest().body("Failed to create payment URL");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/return")
    public String paymentReturn(HttpServletRequest request) {
        Map<String, String[]> params = request.getParameterMap();
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String queryParams = request.getQueryString();
        StringBuilder redirectUrl = new StringBuilder();
        redirectUrl.append("http://localhost:5173/payment/return?");
        redirectUrl.append(queryParams);
        if ("00".equals(vnp_ResponseCode)) {
            try {
                if (vnp_TxnRef != null && !vnp_TxnRef.isEmpty()) {
                    Long orderId = Long.parseLong(vnp_TxnRef);
                    orderService.updateOrderStatus(orderId, "PAID");
                }
            } catch (Exception e) {
                System.err.println("Error updating order: " + e.getMessage());
            }
        } else {
            try {
                if (vnp_TxnRef != null && !vnp_TxnRef.isEmpty()) {
                    Long orderId = Long.parseLong(vnp_TxnRef);
                    orderService.updateOrderStatus(orderId, "PAYMENT_FAILED");
                }
            } catch (Exception e) {
                System.err.println("Error updating order: " + e.getMessage());
            }
        }
        return "redirect:" + redirectUrl.toString();
    }

}