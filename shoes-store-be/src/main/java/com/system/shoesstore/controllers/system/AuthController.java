package com.system.shoesstore.controllers.system;


import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.models.system.ChangePasswordModel;
import com.system.shoesstore.models.system.Login;
import com.system.shoesstore.models.system.Register;
import com.system.shoesstore.services.system.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {
    @Autowired
    private UserService userService;

    //API Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody Login login) {
        Response response = userService.verify(login);
        return ResponseEntity.status(response.getStatus() ==
                200 ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(response);
    }


    //    API đăng ký tài khoản quản lý
    @PostMapping("/register-manager")
    public ResponseEntity<Response> register(@RequestBody Login login) {
        Response response = userService.registerManager(login);
        if (response.getStatus() == 201) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    //    API đăng ký tài khoản người dùng
    @PostMapping("/register-user")
    public ResponseEntity<Response> registerUser(@RequestBody Register login) {
        Response response = userService.registerUser(login);
        if (response.getStatus() == 201) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    //    API đổi mật khẩu
    @PutMapping("/change-password")
    public ResponseEntity<Response> changePassword(@RequestBody ChangePasswordModel changePasswordModel) {
        Response response = userService.changePassword(changePasswordModel);
        if (response.getStatus() == 200) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 400) {
            return ResponseEntity.badRequest().body(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }       
    }

}
