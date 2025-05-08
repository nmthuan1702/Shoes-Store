package com.system.shoesstore.controllers.admin;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.models.manager.ProductModel;
import com.system.shoesstore.services.admin.AdminProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {
    @Autowired
    private AdminProductService adminProductService;

    @GetMapping("/product")
    public ResponseEntity<Response> getAllProducts() {
        try {
            Response response = adminProductService.getAllProducts();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách sản phẩm: " + e.getMessage(),
                            null));
        }
    }
    @PostMapping("/product")
    public ResponseEntity<Response> createProduct(@RequestBody ProductModel productModel) {
        try {
            Response response = adminProductService.createProduct(productModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi thêm sản phẩm: " + e.getMessage(), null));
        }
    }
}
