package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.modals.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBidServiceRequestId(Long serviceRequestId);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByProviderId(Long providerId);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    List<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status);
}
