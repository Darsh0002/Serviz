package com.darsh.Serviz_Backend.modals;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long requestId;
    private Long providerId;
    private String providerName;

    private Long price;

    @Column(length = 300)
    private String message;

    @Enumerated(EnumType.STRING)
    private BidStatus status; // PENDING, ACCEPTED, REJECTED

    private LocalDateTime createdAt;
}
