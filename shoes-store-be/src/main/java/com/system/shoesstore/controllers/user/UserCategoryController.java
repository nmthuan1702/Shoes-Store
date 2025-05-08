package com.system.shoesstore.controllers.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.services.user.UserCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user")
public class UserCategoryController {
    @Autowired
    private UserCategoryService userCategoryService;

    @GetMapping("/category")
    public ResponseEntity<Response> getCategory() {
        try {
            Response response = userCategoryService.getAllCategories();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách danh mucj: " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Response> getCategoryByID(@PathVariable Integer categoryId) {
        try {
            Response response = userCategoryService.getCategoryById(categoryId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách danh mucj: " + e.getMessage(),
                            null));
        }
    }
}
