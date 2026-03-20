package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.requests.LoginReq;
import com.darsh.Serviz_Backend.responses.LoginResponse;
import com.darsh.Serviz_Backend.requests.ProviderSignUpReq;
import com.darsh.Serviz_Backend.requests.UserSignUpReq;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup/user")
    public ResponseEntity<String> signUpUser(@RequestBody UserSignUpReq req) throws Exception {
        boolean userExists = authService.checkIfUserExistByEmail(req.getEmail());
        if (userExists) {
            return new ResponseEntity<>("Email Already Exists", HttpStatus.BAD_REQUEST);
        }

        User savedUser = authService.createUser(req);
        return ResponseEntity.ok("User Sign Up Successful");
    }

    @PostMapping("/signup/provider")
    public ResponseEntity<String> signUpProvider(@RequestBody ProviderSignUpReq req) throws Exception {
        boolean providerExists = authService.checkIfProviderExistByEmail(req.getEmail());
        if (providerExists) {
            return new ResponseEntity<>("Email Already Exists", HttpStatus.BAD_REQUEST);
        }

        Provider savedProvider = authService.createProvider(req);
        return ResponseEntity.ok("Provider Sign Up Successfull");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginReq req) {

        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Invalid email or password", null));
        }
    }
}
