package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.*;
import com.darsh.Serviz_Backend.repositories.*;
import com.darsh.Serviz_Backend.requests.BidRequest;
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
    private ServiceRequestRepo requestRepo;

    @Autowired
    private ProviderRepo providerRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BookingRepo bookingRepo;

    public void placeBid(String email, BidRequest req) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Provider provider = user.getProvider();

        ServiceRequest serviceReq = requestRepo.findById(req.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (serviceReq.getStatus() != ServiceReqStatus.OPEN) {
            throw new RuntimeException("Bidding closed for this request");
        }

        if (!serviceReq.getCity().equals(provider.getUser().getCity()) ||
                !serviceReq.getServiceType().equals(provider.getServiceType())) {
            throw new RuntimeException("Request does not match provider");
        }

        if (bidRepo.existsByRequestIdAndProviderId(serviceReq.getId(), provider.getId())) {
            throw new RuntimeException("Already bid on this request");
        }

        Bid bid = new Bid();
        bid.setRequestId(req.getRequestId());
        bid.setProviderId(provider.getId());
        bid.setProviderName(user.getName());
        bid.setPrice(req.getPrice());
        bid.setMessage(req.getMessage());
        bid.setStatus(BidStatus.PENDING);
        bid.setCreatedAt(LocalDateTime.now());

        bidRepo.save(bid);
    }

    public List<Bid> getBidsForRequest(Long requestId, String email) {

        ServiceRequest req = requestRepo.findById(requestId)
                .orElseThrow();

        User user = userRepo.findByEmail(email)
                .orElseThrow();

        if (!req.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not your request");
        }

        return bidRepo.findByRequestId(requestId);
    }

    public Bid getAcceptedBid(Long requestId){
        return bidRepo
                .findByRequestIdAndStatus(requestId, BidStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No accepted Bid found"));
    }

    @Transactional
    public void acceptBid(Long requestId, Long bidId, String email) {

        ServiceRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ownership check
        if (!req.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not your request");
        }

        // Status check
        if (req.getStatus() != ServiceReqStatus.OPEN) {
            throw new RuntimeException("Request already assigned");
        }

        Bid acceptedBid = bidRepo.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        // Ensure bid belongs to this request
        if (!acceptedBid.getRequestId().equals(requestId)) {
            throw new RuntimeException("Bid does not belong to this request");
        }

        // Accept selected bid
        acceptedBid.setStatus(BidStatus.ACCEPTED);

        // Reject all other bids
        bidRepo.findByRequestId(requestId)
                .forEach(b -> {
                    if (!b.getId().equals(bidId)) {
                        b.setStatus(BidStatus.REJECTED);
                    }
                });

        // Update request status
        req.setStatus(ServiceReqStatus.ASSIGNED);

        Booking booking = new Booking();
        booking.setRequestId(requestId);
        booking.setBidId(bidId);
        booking.setUserId(user.getId());
        booking.setProviderId(acceptedBid.getProviderId());
        booking.setPrice(acceptedBid.getPrice());
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookedAt(LocalDateTime.now());

        bookingRepo.save(booking);
    }
}
