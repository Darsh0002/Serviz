package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.repositories.ProviderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class ProviderController {

    @Autowired
    private ProviderRepo providerRepo;

    @GetMapping("/provider/profile")
    public ResponseEntity<Provider> getProviderProfile(Authentication auth) {
        Provider provider = providerRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return ResponseEntity.ok(provider);
    }
}
