package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Bid;
import com.darsh.Serviz_Backend.modals.ServiceRequest;
import com.darsh.Serviz_Backend.requests.BidReq;
import com.darsh.Serviz_Backend.services.BidService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping("/provider/bid")
    public ResponseEntity<Bid> placeBid(
            @RequestBody BidReq req,
            Authentication auth
    ) {
        return ResponseEntity.ok(bidService.placeBid(auth.getName(), req));
    }

    // View bids on a specific request
    @GetMapping("/user/request/{requestId}/bids")
    public ResponseEntity<List<Bid>> getBidsForRequest(
            @PathVariable Long requestId,
            Authentication auth
    ) throws BadRequestException {
        return ResponseEntity.ok(bidService.getBidsForRequest(requestId, auth.getName()));
    }

    @GetMapping("/user/accepted-bid/{requestId}")
    public ResponseEntity<Bid> getAcceptedBid(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Bid acceptedBid = bidService.getAcceptedBid(
                requestId
        );

        return ResponseEntity.ok(acceptedBid);
    }

    @PostMapping("/user/requests/{requestId}/accept-bid/{bidId}")
    public ResponseEntity<ServiceRequest> acceptBid(
            @PathVariable Long requestId,
            @PathVariable Long bidId,
            Authentication auth
    ) throws BadRequestException {
        return ResponseEntity.ok(bidService.acceptBid(auth.getName(), requestId, bidId));
    }
}

