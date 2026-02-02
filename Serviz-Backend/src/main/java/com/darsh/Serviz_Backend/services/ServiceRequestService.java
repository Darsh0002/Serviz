package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.*;
import com.darsh.Serviz_Backend.repositories.BidRepo;
import com.darsh.Serviz_Backend.requests.RequestDTO;
import com.darsh.Serviz_Backend.repositories.ServiceRequestRepo;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import com.darsh.Serviz_Backend.responses.ServiceRequestResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BidRepo bidRepo;

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

    @Transactional
    public void completeJob(Long requestId, String email) {

        ServiceRequest req = serviceRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only request owner can complete
        if (!req.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not your request");
        }

        // Must be ASSIGNED
        if (req.getStatus() != ServiceReqStatus.ASSIGNED) {
            throw new RuntimeException("Job is not in assigned state");
        }

        // Ensure an accepted bid exists
        Bid acceptedBid = bidRepo
                .findByRequestIdAndStatus(requestId, BidStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No accepted provider found"));

        // Mark job completed
        req.setStatus(ServiceReqStatus.COMPLETED);
        req.setCompletedAt(LocalDateTime.now());
    }

    public List<ServiceRequest> getOpenRequestsForUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return serviceRequestRepo.findByUserIdAndStatus(user.getId(), ServiceReqStatus.OPEN);
    }

    public List<ServiceRequest> getRecentRequestsForUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        List<ServiceRequest> assignedRequests =
                serviceRequestRepo.findByUserIdAndStatus(user.getId(), ServiceReqStatus.ASSIGNED);
        List<ServiceRequest> completedRequests =
                serviceRequestRepo.findByUserIdAndStatus(user.getId(), ServiceReqStatus.COMPLETED);
        List<ServiceRequest> cancelledRequests =
                serviceRequestRepo.findByUserIdAndStatus(user.getId(), ServiceReqStatus.CANCELLED);

        List<ServiceRequest> recent = new ArrayList<>();
        recent.addAll(assignedRequests);
        recent.addAll(completedRequests);
        recent.addAll(cancelledRequests);

        return recent;
    }
}
