package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.*;
import com.darsh.Serviz_Backend.repositories.*;
import com.darsh.Serviz_Backend.requests.BidReq;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {

    @Autowired
    private BidRepo bidRepo;

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ProviderRepo providerRepo;

    @Autowired
    private BookingRepo bookingRepo;

    public Bid placeBid(String email, BidReq req) {
        Provider provider = providerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        ServiceRequest serviceRequest = serviceRequestRepo.findById(req.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if(!provider.getServiceType().equals(serviceRequest.getServiceType())){
            throw new RuntimeException("You are not eligible to bid on this request");
        }

        if (!provider.getCity().equalsIgnoreCase(serviceRequest.getCity())) {
            throw new RuntimeException("You cannot bid on requests outside your city");
        }

        if (serviceRequest.getStatus() != ServiceReqStatus.OPEN) {
            throw new RuntimeException("Request is not open for bidding");
        }

        // Prevent duplicate bids from the same provider
        if (bidRepo.existsByServiceRequestIdAndProviderId(req.getRequestId(), provider.getId())) {
            throw new RuntimeException("You have already placed a bid");
        }

        Bid bid = new Bid();
        bid.setServiceRequest(serviceRequest);
        bid.setProvider(provider);
        bid.setPrice(req.getPrice());
        bid.setEstimatedTimeInHours(req.getEstimatedTimeInHours());
        bid.setMessage(req.getMessage());
        bid.setStatus(BidStatus.PENDING);
        bid.setCreatedAt(LocalDateTime.now());

        return bidRepo.save(bid);
    }

    public List<Bid> getBidsForRequest(Long requestId, String email) throws BadRequestException {
        ServiceRequest request = serviceRequestService.getRequestAndVerifyOwner(email, requestId);
        return bidRepo.findByServiceRequestId(request.getId());
    }

    public Bid getAcceptedBid(Long requestId) {
        serviceRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        return bidRepo
                .findByServiceRequestIdAndStatus(requestId, BidStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No accepted bid found"));
    }

    // ── User: Accept a bid ────────────────────────────────────────

    @Transactional
    public ServiceRequest acceptBid(String email, Long requestId, Long bidId) throws BadRequestException {
        ServiceRequest request = serviceRequestService.getRequestAndVerifyOwner(email, requestId);

        if (request.getStatus() != ServiceReqStatus.OPEN) {
            throw new RuntimeException("Request is no longer open for bidding");
        }

        Bid acceptedBid = bidRepo.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        if (!acceptedBid.getServiceRequest().getId().equals(requestId)) {
            throw new RuntimeException("Bid does not belong to this request");
        }

        // Accept the chosen bid
        acceptedBid.setStatus(BidStatus.ACCEPTED);
        bidRepo.save(acceptedBid);

        // Reject all other bids
        List<Bid> otherBids = bidRepo.findByServiceRequestIdAndStatus(
                requestId, BidStatus.PENDING
        );
        otherBids.forEach(bid -> bid.setStatus(BidStatus.REJECTED));
        bidRepo.saveAll(otherBids);

        // Assign provider and update status
        request.setAssignedProvider(acceptedBid.getProvider());
        request.setStatus(ServiceReqStatus.ASSIGNED);
        serviceRequestRepo.save(request);

        Booking booking = new Booking();
        booking.setBid(acceptedBid);
        booking.setUser(request.getUser());
        booking.setProvider(acceptedBid.getProvider());
        booking.setStatus(BookingStatus.SCHEDULED);
        booking.setBookedAt(LocalDateTime.now());

        bookingRepo.save(booking);

        return request;
    }
}
