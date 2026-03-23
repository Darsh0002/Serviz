package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Rating;
import com.darsh.Serviz_Backend.requests.RatingRequest;
import com.darsh.Serviz_Backend.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // User submits a rating after completed booking
    @PostMapping("/rating")
    public ResponseEntity<Rating> submitRating(
            @RequestBody RatingRequest req,
            Authentication auth
    ) {
        return ResponseEntity.ok(ratingService.submitRating(auth.getName(), req));
    }
}

