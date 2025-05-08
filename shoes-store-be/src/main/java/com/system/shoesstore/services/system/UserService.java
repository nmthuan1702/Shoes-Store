package com.system.shoesstore.services.system;

import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.dtos.RoleDto;
import com.system.shoesstore.dtos.UserDto;
import com.system.shoesstore.entities.Role;
import com.system.shoesstore.entities.User;
import com.system.shoesstore.models.system.ChangePasswordModel;
import com.system.shoesstore.models.system.Login;

import com.system.shoesstore.models.system.Register;
import com.system.shoesstore.repositories.RoleRepository;
import com.system.shoesstore.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepository repo;

    @Autowired
    private RoleRepository roleRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    //      Đăng ký tài khoản quản lý (ADMIN)
    public Response registerManager(Login user) {
        if (repo.existsByUsername(user.getUsername())) {
            return new Response(400, "Tên đăng nhập đã tồn tại!", null);
        }

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(encoder.encode(user.getPassword()));
        newUser.setCreatedAt(Instant.now());
        newUser.setRole(getRoleByName("ADMIN"));
        repo.save(newUser);
        return new Response(201, "Tạo tài khoản thành công!", convertToDto(newUser));
    }  //      Đăng ký tài khoản quản lý (ADMIN)

    public Response registerUser(Register user) {
        if (repo.existsByUsername(user.getUsername())) {
            return new Response(400, "Tên đăng nhập đã tồn tại!", null);
        }
        if (repo.existsByEmail(user.getEmail())) {
            return new Response(400, "Email đã tồn tại!", null);
        }
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(encoder.encode(user.getPassword()));
        newUser.setCreatedAt(Instant.now());
        newUser.setEmail(user.getEmail());
        newUser.setRole(getRoleByName("USER"));
        repo.save(newUser);
        return new Response(201, "Tạo tài khoản thành công!", convertToDto(newUser));
    }

    //      Xác thực đăng nhập
    public Response verify(Login user) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            if (!authentication.isAuthenticated()) {
                return new Response(401, "Sai thông tin đăng nhập!", null);
            }

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("username", user.getUsername());
            responseData.put("token", jwtService.generateToken(user.getUsername()));
            responseData.put("role", getRoleByUsername(user.getUsername()));
            return new Response(200, "Đăng nhập thành công!", responseData);
        } catch (Exception e) {
            return new Response(401, "Sai thông tin đăng nhập!", null);
        }
    }


    //      Đổi mật khẩu người dùng
    public Response changePassword(ChangePasswordModel model) {
        if (!repo.existsByUsername(model.getUsername())) {
            return new Response(404, "Người dùng không tồn tại!", null);
        }

        User user = repo.findByUsername(model.getUsername()).orElse(null);
        if (user == null || !encoder.matches(model.getOldPassword(), user.getPassword())) {
            return new Response(400, "Mật khẩu cũ không chính xác!", null);
        }

        user.setPassword(encoder.encode(model.getNewPassword()));
        repo.save(user);
        return new Response(200, "Mật khẩu đã được thay đổi thành công!", null);
    }


    //      Tìm vai trò theo tên
    private Role getRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName).orElse(null);
    }

//      Lấy tên vai trò theo username

    private String getRoleByUsername(String username) {
        return roleRepository.findRoleNameByUsername(username);
    }


    //      Chuyển đổi User entity sang UserDto
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        if (user.getRole() != null) {
            RoleDto roleDto = new RoleDto();
            roleDto.setId(user.getRole().getId());
            roleDto.setRoleName(user.getRole().getRoleName());
            dto.setRole(roleDto);
        }

        return dto;
    }
}
