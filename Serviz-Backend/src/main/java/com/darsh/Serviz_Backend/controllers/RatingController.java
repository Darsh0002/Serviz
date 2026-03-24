package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Rating;
import com.darsh.Serviz_Backend.requests.RatingRequest;
import com.darsh.Serviz_Backend.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // User submits a rating after completed booking
    @PostMapping("/user/rating")
    public ResponseEntity<Rating> submitRating(
            @RequestBody RatingRequest req,
            Authentication auth
    ) {
        return ResponseEntity.ok(ratingService.submitRating(auth.getName(), req));
    }

    @GetMapping("/provider/ratings")
    public ResponseEntity<List<Rating>> getRatingsOfProvider(
            Authentication auth
    ){
        return ResponseEntity.ok(ratingService.getProviderRatings(auth.getName()));
    }
}

