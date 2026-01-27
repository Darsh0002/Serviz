package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Bid;
import com.darsh.Serviz_Backend.requests.BidRequest;
import com.darsh.Serviz_Backend.services.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> placeBid(
            @RequestBody BidRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        bidService.placeBid(
                userDetails.getUsername(),
                req
        );
        return ResponseEntity.ok("Bid placed successfully");
    }

    @GetMapping("/user/requests/{requestId}/bids")
    public ResponseEntity<List<Bid>> getBidsForRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        List<Bid> bids = bidService.getBidsForRequest(
                requestId,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(bids);
    }

    @PostMapping("/user/requests/{requestId}/select-bid/{bidId}")
    public ResponseEntity<String> selectBid(
            @PathVariable Long requestId,
            @PathVariable Long bidId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        bidService.selectProvider(
                requestId,
                bidId,
                userDetails.getUsername()
        );

        return ResponseEntity.ok("Provider selected successfully");
    }
}

