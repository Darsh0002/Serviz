package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.modals.BookingStatus;
import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.repositories.BookingRepo;
import com.darsh.Serviz_Backend.repositories.ProviderRepo;
import com.darsh.Serviz_Backend.repositories.ServiceRequestRepo;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProviderRepo providerRepo;

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    // Get booking by ID — accessible by the user or provider involved
    public Booking getBookingById(Long bookingId, String email) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isUser = booking.getUser().getEmail().equals(email);
        boolean isProvider = booking.getProvider().getEmail().equals(email);

        if (!isUser && !isProvider) {
            throw new AccessDeniedException("You are not part of this booking");
        }

        return booking;
    }

    // Get booking by service request ID
    public Booking getBookingByServiceRequestId(Long requestId, String email) {
        serviceRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        Booking booking = bookingRepo.findByBidServiceRequestId(requestId)
                .orElseThrow(() -> new RuntimeException("No booking found for this request"));

        boolean isUser = booking.getUser().getEmail().equals(email);
        boolean isProvider = booking.getProvider().getEmail().equals(email);

        if (!isUser && !isProvider) {
            throw new AccessDeniedException("You are not part of this booking");
        }

        return booking;
    }

    // Get all bookings for logged-in user
    public List<Booking> getUserBookings(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepo.findByUserId(user.getId());
    }

    // Get all bookings for logged-in provider
    public List<Booking> getProviderBookings(String email) {
        Provider provider = providerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return bookingRepo.findByProviderId(provider.getId());
    }

    // Get user's bookings filtered by status
    public List<Booking> getUserBookingsByStatus(String email, BookingStatus status) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepo.findByUserIdAndStatus(user.getId(), status);
    }

    // Get provider's bookings filtered by status
    public List<Booking> getProviderBookingsByStatus(String email, BookingStatus status) {
        Provider provider = providerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return bookingRepo.findByProviderIdAndStatus(provider.getId(), status);
    }
}