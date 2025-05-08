package com.system.shoesstore.controllers.user;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.models.customer.CartModel;
import com.system.shoesstore.models.customer.UpdateQuantityModel;
import com.system.shoesstore.services.user.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user")
public class ShoppingCartController {
    @Autowired
    private ShoppingCartService shoppingCartService;

    @GetMapping("/shopping-cart")
    public ResponseEntity<Response> shoppingCart(@RequestParam String username) {
        try {
            Response response = shoppingCartService.getShoppingCart(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách danh mucj: " + e.getMessage(),
                            null));
        }
    }

    @PostMapping("/shopping-cart")
    public ResponseEntity<Response> addToCart(@RequestBody CartModel cartModel) {
        try {
            Response response = shoppingCartService.addToCart(cartModel);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi thêm sản phẩm vào giỏ hàng: " + e.getMessage(),
                            null));
        }
    }

    @PutMapping("/shopping-cart")
    public Response updateQuantity(@RequestBody UpdateQuantityModel updateQuantityModel) {
        return shoppingCartService.updateQuantity(updateQuantityModel.getCartDetailId(), updateQuantityModel.getQuantity());
    }

    @DeleteMapping("/shopping-cart/cart-detail")
    public ResponseEntity<Response> deleteToCartDetail(@RequestParam Integer cartId) {
        try {
            Response response = shoppingCartService.removeCartItem(cartId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }

    @DeleteMapping("/shopping-cart/{username}")
    public ResponseEntity<Response> deleteToCart(@PathVariable String username) {
        try {
            Response response = shoppingCartService.removeFromCart(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi: " + e.getMessage(),
                            null));
        }
    }
}
