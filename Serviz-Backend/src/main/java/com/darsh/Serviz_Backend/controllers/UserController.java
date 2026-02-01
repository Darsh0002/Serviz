package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.services.ProviderService;
import com.darsh.Serviz_Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProviderService providerService;

    @GetMapping("/u/profile")
    public ResponseEntity<User> getUserFromToken(Authentication authentication) throws Exception {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/providers/{providerId}")
    public ResponseEntity<Provider> getProvider(@PathVariable Long providerId) throws Exception {
        Provider provider = providerService.getProviderDetail(providerId);
        return ResponseEntity.ok(provider);
    }
}
