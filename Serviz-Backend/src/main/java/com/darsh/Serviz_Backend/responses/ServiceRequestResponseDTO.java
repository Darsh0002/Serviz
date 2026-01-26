package com.darsh.Serviz_Backend.responses;

import com.darsh.Serviz_Backend.modals.ServiceReqStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceRequestResponseDTO {
    private Long id;
    private String serviceType;
    private String address;
    private String city;
    private String description;
    private String userName;
    private String userPhone;
    private ServiceReqStatus status;
    private LocalDateTime createdAt;
}

