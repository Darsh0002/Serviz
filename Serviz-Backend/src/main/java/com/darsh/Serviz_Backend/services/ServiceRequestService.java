package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.*;
import com.darsh.Serviz_Backend.repositories.*;
import com.darsh.Serviz_Backend.requests.ServiceRequestReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProviderRepo providerRepo;

    @Autowired
    private BidRepo bidRepo;

    @Autowired
    private BookingRepo bookingRepo;

    // ── User: Raise a service request ────────────────────────────
    public ServiceRequest createRequest(String email, ServiceRequestReq req) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest newReq = new ServiceRequest();
        newReq.setUser(user);
        newReq.setServiceType(req.getServiceType());
        newReq.setAddress(req.getAddress());
        newReq.setCity(req.getCity());
        newReq.setDescription(req.getDescription());
        newReq.setStatus(ServiceReqStatus.OPEN);
        newReq.setCreatedAt(LocalDateTime.now());

        return serviceRequestRepo.save(newReq);
    }

    // ── User: View own requests ───────────────────────────────────
    public List<ServiceRequest> getUserRequests(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return serviceRequestRepo.findByUserId(user.getId());
    }

    // ── User: Cancel a request ────────────────────────────────────
    public ServiceRequest cancelRequest(String email, Long requestId) {
        ServiceRequest request = getRequestAndVerifyOwner(email, requestId);

        if (request.getStatus() == ServiceReqStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed request");
        }
        if (request.getStatus() == ServiceReqStatus.CANCELLED) {
            throw new RuntimeException("Request is already cancelled");
        }

        request.setStatus(ServiceReqStatus.CANCELLED);

        bookingRepo.findByBidServiceRequestId(requestId).ifPresent(booking -> {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepo.save(booking);
        });

        return serviceRequestRepo.save(request);
    }

    // ── Provider: View OPEN requests matching their service type ──
    public List<ServiceRequest> getOpenRequestsForProvider(String email) {

        Provider provider = providerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        return serviceRequestRepo.findByCityAndServiceTypeAndStatus(
                        provider.getCity(),
                        provider.getServiceType(),
                        ServiceReqStatus.OPEN
                );
    }

    public ServiceRequest completeRequest(Long requestId, String email) {

        ServiceRequest req = getRequestAndVerifyOwner(email, requestId);

        if (req.getStatus() != ServiceReqStatus.ASSIGNED) {
            throw new RuntimeException("Request is not in an assigned state");
        }

        // Ensure an accepted bid exists
        List<Bid> acceptedBids = bidRepo.findByServiceRequestIdAndStatus(requestId, BidStatus.ACCEPTED);
        if (acceptedBids.isEmpty()) {
            throw new RuntimeException("No accepted bid found");
        }

        bookingRepo.findByBidServiceRequestId(requestId).ifPresent(booking -> {
            booking.setStatus(BookingStatus.COMPLETED);
            booking.setCompletedAt(LocalDateTime.now());
            bookingRepo.save(booking);
        });

        // Mark job completed
        req.setStatus(ServiceReqStatus.COMPLETED);
        req.setCompletedAt(LocalDateTime.now());
        return serviceRequestRepo.save(req);
    }

    public List<ServiceRequest> getOpenRequestsForUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return serviceRequestRepo.findByUserAndStatus(user, ServiceReqStatus.OPEN);
    }

    // ── Helper ────────────────────────────────────────────────────

    public ServiceRequest getRequestAndVerifyOwner(String email, Long requestId){
        ServiceRequest request = serviceRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not own this request");
        }

        return request;
    }
}
