package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.requests.RequestDTO;
import com.darsh.Serviz_Backend.responses.ServiceRequestResponseDTO;
import com.darsh.Serviz_Backend.services.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService requestService;

    @PostMapping("/user/create")
    public ResponseEntity<String> createService(
            @RequestBody RequestDTO req,
            @AuthenticationPrincipal UserDetails userDetails
            ){
        requestService.createService(req, userDetails.getUsername());
        return ResponseEntity.ok("Service Request Created Successfully");
    }

    @GetMapping("/provider/requests")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getRequestsByCityAndStatus(
            @AuthenticationPrincipal UserDetails userDetails
    ){
        List<ServiceRequestResponseDTO> requests = requestService.getOpenRequestsForProvider(userDetails.getUsername());
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/user/requests/{requestId}/complete")
    public ResponseEntity<String> completeJob(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        requestService.completeJob(
                requestId,
                userDetails.getUsername()
        );

        return ResponseEntity.ok("Job marked as completed");
    }
}
