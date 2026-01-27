package com.darsh.Serviz_Backend.modals;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    private Long userId;
    private String serviceType;
    private String address;
    private String city;
    private String description;

    @Enumerated(EnumType.STRING)
    private ServiceReqStatus status;  // OPEN, ASSIGNED, COMPLETED, CANCELLED

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
