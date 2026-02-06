package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.repositories.BookingRepo;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private UserRepo userRepo;

    public List<Booking> getBookingsForUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepo.findAllByUserId(user.getId());
    }
}
