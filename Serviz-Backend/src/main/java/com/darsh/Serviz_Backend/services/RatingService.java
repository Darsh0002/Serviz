package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.*;
import com.darsh.Serviz_Backend.repositories.*;
import com.darsh.Serviz_Backend.requests.RatingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepo ratingRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProviderRepo providerRepo;

    public Rating submitRating(String email, RatingRequest req) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepo.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Only the user who owns the booking can rate
        if (!booking.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not part of this booking");
        }

        // Only after completed booking
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("You can only rate a completed booking");
        }

        // Prevent duplicate rating
        if (ratingRepo.existsByUserIdAndBookingId(user.getId(), booking.getId())) {
            throw new RuntimeException("You have already rated this booking");
        }

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setProvider(booking.getProvider());
        rating.setBooking(booking);
        rating.setScore(req.getScore());
        rating.setReview(req.getReview());
        rating.setCreatedAt(LocalDateTime.now());

        ratingRepo.save(rating);

        // Update provider's avgRating
        updateProviderAvgRating(booking.getProvider());

        return rating;
    }

    public List<Rating> getProviderRatings(Long providerId) {
        providerRepo.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return ratingRepo.findByProviderId(providerId);
    }

    private void updateProviderAvgRating(Provider provider) {
        Double avg = ratingRepo.findAvgScoreByProviderId(provider.getId());
        provider.setAvgRating(avg != null ? avg : 0.0);
        providerRepo.save(provider);
    }
}


