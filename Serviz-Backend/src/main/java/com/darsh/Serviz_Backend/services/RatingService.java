package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.*;
import com.darsh.Serviz_Backend.repositories.*;
import com.darsh.Serviz_Backend.requests.RatingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RatingService {

    @Autowired
    private RatingRepo ratingRepo;

    @Autowired
    private ServiceRequestRepo requestRepo;

    @Autowired
    private BidRepo bidRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProviderRepo providerRepo;

    @Transactional
    public void rateProvider(String email, RatingRequest req) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest serviceRequest = requestRepo.findById(req.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Ownership check
        if (!serviceRequest.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not your request");
        }

        // Must be COMPLETED
        if (serviceRequest.getStatus() != ServiceReqStatus.COMPLETED) {
            throw new RuntimeException("Job not completed yet");
        }

        // Prevent duplicate rating
        if (ratingRepo.existsByUserIdAndRequestId(user.getId(), req.getRequestId())) {
            throw new RuntimeException("You have already rated this job");
        }

        // Score validation
        if (req.getScore() < 1 || req.getScore() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Get accepted provider
        Bid acceptedBid = bidRepo
                .findByRequestIdAndStatus(req.getRequestId(), BidStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No accepted provider"));

        // Save rating
        Rating rating = new Rating();
        rating.setUserId(user.getId());
        rating.setProviderId(acceptedBid.getProviderId());
        rating.setRequestId(req.getRequestId());
        rating.setScore(req.getScore());
        rating.setReview(req.getReview());
        rating.setCreatedAt(LocalDateTime.now());

        ratingRepo.save(rating);

        // Update provider average rating
        Double avg = ratingRepo.findAverageByProviderId(acceptedBid.getProviderId());

        Provider provider = providerRepo.findById(acceptedBid.getProviderId())
                .orElseThrow();

        provider.setAvgRating(avg);
        providerRepo.save(provider);
    }
}


