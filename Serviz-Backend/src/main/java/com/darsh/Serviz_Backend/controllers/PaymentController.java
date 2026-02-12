package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<?> createOrder(
            @PathVariable Long bookingId) throws Exception {

        return ResponseEntity.ok(
                paymentService.createOrder(bookingId)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(
            @RequestBody Map<String, String> data)
            throws Exception {

        return ResponseEntity.ok(
                paymentService.verifyPayment(data)
        );
    }
}
