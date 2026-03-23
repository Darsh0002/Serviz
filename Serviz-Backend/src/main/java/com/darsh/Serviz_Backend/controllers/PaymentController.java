package com.darsh.Serviz_Backend.controllers;

import com.darsh.Serviz_Backend.modals.Payment;
import com.darsh.Serviz_Backend.requests.PaymentVerifyRequest;
import com.darsh.Serviz_Backend.services.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<?> createOrder(
            @PathVariable Long bookingId,
            Authentication auth) throws RazorpayException {

        return ResponseEntity.ok(
                paymentService.createOrder(auth.getName(), bookingId)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(
            @RequestBody PaymentVerifyRequest req
    ) throws RazorpayException {
        return ResponseEntity.ok(paymentService.verifyPayment(req));
    }

    // Get payment status by booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(
            @PathVariable Long bookingId,
            Authentication auth
    ) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(auth.getName(), bookingId));
    }
}
