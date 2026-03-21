package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.ServiceRequest;
import com.darsh.Serviz_Backend.requests.ServiceRequestReq;
import com.darsh.Serviz_Backend.services.ServiceRequestService;
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
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService requestService;

    // Raise a service request
    @PostMapping("/user/request")
    public ResponseEntity<ServiceRequest> createService(
            @RequestBody ServiceRequestReq req,
            Authentication auth
    ) {
        return ResponseEntity.ok(requestService.createRequest(auth.getName(), req));
    }

    // View own requests
    @GetMapping("/user/all-requests")
    public ResponseEntity<List<ServiceRequest>> getUserRequests(
            Authentication auth
    ) {
        return ResponseEntity.ok(requestService.getUserRequests(auth.getName()));
    }

    @GetMapping("/user/open-req")
    public ResponseEntity<List<ServiceRequest>> getOpenRequestsForUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ServiceRequest> requests = requestService.getOpenRequestsForUser(userDetails.getUsername());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/provider/requests")
    public ResponseEntity<List<ServiceRequest>> getOpenRequestsForProvider(
            Authentication auth
    ) {
        return ResponseEntity.ok(requestService.getOpenRequestsForProvider(auth.getName()));
    }

    // Mark request as completed
    @PutMapping("/user/requests/{requestId}/complete")
    public ResponseEntity<ServiceRequest> completeRequest(
            @PathVariable Long requestId,
            Authentication auth
    ) throws BadRequestException {
        return ResponseEntity.ok(requestService.completeRequest(requestId, auth.getName()));
    }

    // Cancel a request
    @PutMapping("/user/request/{requestId}/cancel")
    public ResponseEntity<ServiceRequest> cancelRequest(
            @PathVariable Long requestId,
            Authentication auth
    ) throws BadRequestException {
        return ResponseEntity.ok(requestService.cancelRequest(auth.getName(), requestId));
    }
}
