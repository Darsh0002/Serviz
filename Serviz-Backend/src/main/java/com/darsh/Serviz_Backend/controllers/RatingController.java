package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.requests.RatingRequest;
import com.darsh.Serviz_Backend.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/rate")
    public ResponseEntity<String> rateProvider(
            @RequestBody RatingRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ratingService.rateProvider(
                userDetails.getUsername(),
                req
        );
        return ResponseEntity.ok("Rating submitted successfully");
    }
}

