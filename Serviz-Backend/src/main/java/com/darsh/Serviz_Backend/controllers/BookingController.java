package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.modals.BookingStatus;
import com.darsh.Serviz_Backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Shared — get booking by ID (user or provider)
    @GetMapping({"/user/booking/{bookingId}","/provider/booking/{bookingId}"})
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long bookingId,
            Authentication auth
    ) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId, auth.getName()));
    }

    // Shared — get booking by service request ID (user or provider)
    @GetMapping({"/user/booking/request/{requestId}","/provider/booking/request/{requestId}"})
    public ResponseEntity<Booking> getBookingByRequestId(
            @PathVariable Long requestId,
            Authentication auth
    ) {
        return ResponseEntity.ok(bookingService.getBookingByServiceRequestId(requestId, auth.getName()));
    }

    // User — get all bookings
    @GetMapping("/user/bookings")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getUserBookings(auth.getName()));
    }

    // User — get bookings filtered by status (?status=SCHEDULED
    @GetMapping("/user/bookings/filter")
    public ResponseEntity<List<Booking>> getUserBookingsByStatus(
            @RequestParam BookingStatus status,
            Authentication auth
    ) {
        return ResponseEntity.ok(bookingService.getUserBookingsByStatus(auth.getName(), status));
    }

    // Provider — get all bookings
    @GetMapping("/provider/bookings")
    public ResponseEntity<List<Booking>> getProviderBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getProviderBookings(auth.getName()));
    }

    // Provider — get bookings filtered by status (?status=COMPLETED)
    @GetMapping("/provider/bookings/filter")
    public ResponseEntity<List<Booking>> getProviderBookingsByStatus(
            @RequestParam BookingStatus status,
            Authentication auth
    ) {
        return ResponseEntity.ok(bookingService.getProviderBookingsByStatus(auth.getName(), status));
    }
}
