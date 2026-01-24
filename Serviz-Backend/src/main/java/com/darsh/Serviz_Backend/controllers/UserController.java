package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.configs.JwtProvider;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserFromToken(@RequestHeader("Authorization") String jwt) throws Exception {
        String email = JwtProvider.getEmailFromToken(jwt);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
