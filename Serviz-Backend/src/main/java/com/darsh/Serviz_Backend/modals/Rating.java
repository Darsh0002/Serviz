package com.darsh.Serviz_Backend.modals;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"userId", "providerId", "requestId"})
        }
)
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long providerId;
    private Long requestId;

    private int score;   // 1–5

    @Column(length = 300)
    private String review;

    private LocalDateTime createdAt;
}

