package com.system.shoesstore.controllers.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.repositories.ProductRepository;
import com.system.shoesstore.services.user.UserCategoryService;
import com.system.shoesstore.services.user.UserProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user")
public class UserProductController {
    @Autowired
    private UserProductService userProductService;

    @GetMapping("/product/category/{categoryId}")
    public ResponseEntity<Response> getProductByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        try {
            Response response = userProductService.getListProductByCategory(categoryId, page, size, sortBy, direction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách : " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/product")
    public ResponseEntity<Response> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        try {
            Response response = userProductService.getAllProduct(page, size, sortBy, direction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách : " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Response> getProductById(@PathVariable Integer productId) {
        try {
            Response response = userProductService.getProductById(productId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách : " + e.getMessage(),
                            null));
        }
    }

}
