package com.system.shoesstore.controllers.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.models.customer.AddressModel;
import com.system.shoesstore.services.user.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user/address")
public class ShippingAddressController {
    @Autowired
    private AddressService addressService;

    @GetMapping("")
    public ResponseEntity<Response> getShippingAddress(@RequestParam String username) {
        try {
            Response response = addressService.getAddressByUsername(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

    @PostMapping("")
    public ResponseEntity<Response> addShippingAddress(@RequestBody AddressModel model) {
        try {
            Response response = addressService.addAddress(model);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

    @PutMapping("")
    public ResponseEntity<Response> updateShippingAddress(@RequestParam Integer shippingAddressId, @RequestBody AddressModel model) {
        try {
            Response response = addressService.updateAddress(shippingAddressId, model);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

    @PutMapping("/deactivate")
    public ResponseEntity<Response> removeShippingAddress(@RequestParam Integer shippingAddressId) {
        try {
            Response response = addressService.removerAddress(shippingAddressId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }
}
