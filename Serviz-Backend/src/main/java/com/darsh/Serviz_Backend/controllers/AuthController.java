package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.configs.JwtProvider;
import com.darsh.Serviz_Backend.dto.LoginRequest;
import com.darsh.Serviz_Backend.dto.LoginResponse;
import com.darsh.Serviz_Backend.dto.ProviderSignUpReq;
import com.darsh.Serviz_Backend.dto.UserSignUpReq;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup/user")
    public ResponseEntity<String> SignUpUser(@RequestBody UserSignUpReq req) {
        User existingUser = userService.getUserByEmail(req.getEmail());
        if (existingUser != null) {
            return new ResponseEntity<>("Email Already Exists", HttpStatus.BAD_REQUEST);
        }

        User savedUser = userService.createUser(req);
        return ResponseEntity.ok("User Sign Up Successfull");
    }

    @PostMapping("/signup/provider")
    public ResponseEntity<String> SignUpProvider(@RequestBody ProviderSignUpReq req) {
        User existingUser = userService.getUserByEmail(req.getEmail());
        if (existingUser != null) {
            return new ResponseEntity<>("Email Already Exists", HttpStatus.BAD_REQUEST);
        }

        User savedUser = userService.createProvider(req);
        return ResponseEntity.ok("Provider Sign Up Successfull");
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest req) {
        try {
            String email = req.getEmail();
            String password = req.getPassword();

            Authentication authentication = userService.authenticateUser(email, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = JwtProvider.generateToken(authentication);

            LoginResponse response = new LoginResponse("Login Successful", jwt);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Invalid email or password", null));
        }
    }
}
