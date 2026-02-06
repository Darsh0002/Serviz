package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/user/")
    public ResponseEntity<List<Booking>> getBookingsForUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<Booking> bookings = bookingService.getBookingsForUser(userDetails.getUsername());
        return ResponseEntity.ok(bookings);
    }
}
