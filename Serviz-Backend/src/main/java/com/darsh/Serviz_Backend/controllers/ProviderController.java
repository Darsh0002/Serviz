package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.services.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping("/get")
    public ResponseEntity<List<Provider>> getProviders(@RequestParam String serviceType){
        List<Provider> providers = providerService.getProvidersByServiceType(serviceType);
        return ResponseEntity.ok(providers);
    }
}
