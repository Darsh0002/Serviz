package com.darsh.Serviz_Backend.modals;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long requestId;
    private Long bidId;

    private Long userId;
    private Long providerId;

    private Long price;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, COMPLETED, CANCELLED

    private LocalDateTime bookedAt;
    private LocalDateTime completedAt;
}
