package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Payment;
import com.darsh.Serviz_Backend.modals.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepo extends JpaRepository<Payment,Long> {
    Optional<Payment> findByRazorpayOrderId(String orderId);
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByBookingIdAndStatus(
            Long bookingId,
            PaymentStatus status
    );
    boolean existsByBookingIdAndStatus(
            Long bookingId,
            PaymentStatus status
    );

}
