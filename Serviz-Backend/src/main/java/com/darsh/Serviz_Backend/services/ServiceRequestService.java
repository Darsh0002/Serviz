package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.requests.RequestDTO;
import com.darsh.Serviz_Backend.modals.ServiceReqStatus;
import com.darsh.Serviz_Backend.modals.ServiceRequest;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.repositories.ServiceRequestRepo;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import com.darsh.Serviz_Backend.responses.ServiceRequestResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    @Autowired
    private UserRepo userRepo;

    public ServiceRequest createService(RequestDTO req, String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest newReq = new ServiceRequest();
        newReq.setUserId(user.getId());
        newReq.setAddress(req.getAddress());
        newReq.setCity(req.getCity());
        newReq.setServiceType(req.getServiceType());
        newReq.setDescription(req.getDescription());

        newReq.setStatus(ServiceReqStatus.OPEN);
        newReq.setCreatedAt(LocalDateTime.now());

        return serviceRequestRepo.save(newReq);
    }

    public List<ServiceRequestResponseDTO> getOpenRequestsForProvider(String email) {

        User provider = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (provider.getProvider() == null) {
            throw new RuntimeException("User is not a provider");
        }

        List<ServiceRequest> requests =
                serviceRequestRepo.findByCityAndServiceTypeAndStatus(
                        provider.getCity(),
                        provider.getProvider().getServiceType(),
                        ServiceReqStatus.OPEN
                );

        return requests.stream().map(req -> {
            User user = userRepo.findById(req.getUserId())
                    .orElseThrow();

            ServiceRequestResponseDTO dto = new ServiceRequestResponseDTO();
            dto.setId(req.getId());
            dto.setServiceType(req.getServiceType());
            dto.setAddress(req.getAddress());
            dto.setCity(req.getCity());
            dto.setDescription(req.getDescription());
            dto.setUserName(user.getName());
            dto.setUserPhone(user.getPhone());
            dto.setStatus(req.getStatus());
            dto.setCreatedAt(req.getCreatedAt());

            return dto;
        }).toList();
    }
}
