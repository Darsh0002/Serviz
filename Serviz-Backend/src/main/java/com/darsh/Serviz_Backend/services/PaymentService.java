package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.modals.BookingStatus;
import com.darsh.Serviz_Backend.modals.Payment;
import com.darsh.Serviz_Backend.modals.PaymentStatus;
import com.darsh.Serviz_Backend.repositories.BookingRepo;
import com.darsh.Serviz_Backend.repositories.PaymentRepo;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import com.darsh.Serviz_Backend.requests.PaymentVerifyRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // User initiates payment, Razorpay order is created
    public Payment createOrder(String email, Long bookingId) throws RazorpayException {
        userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not part of this booking");
        }

        if (booking.getStatus() != BookingStatus.SCHEDULED) {
            throw new RuntimeException("Payment can only be made for scheduled bookings");
        }

        // Prevent duplicate payment
        if (paymentRepo.findByBookingId(booking.getId()).isPresent()) {
            throw new RuntimeException("Payment already initiated for this booking");
        }

        // Amount from accepted bid (convert to paise)
        long amount = Math.round(booking.getBid().getPrice() * 100);

        // Create Razorpay order
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + booking.getId());

        Order razorpayOrder = razorpay.orders.create(orderRequest);

        // Save payment record
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setRazorpayOrderId(razorpayOrder.get("id"));
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());

        return paymentRepo.save(payment);
    }

    // Step 2 — Verify Razorpay signature after frontend confirms payment
    public Payment verifyPayment(PaymentVerifyRequest req) throws RazorpayException {
        Payment payment = paymentRepo.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Verify signature using HMAC-SHA256
        String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
        boolean isValid = Utils.verifyPaymentSignature(
                new JSONObject()
                        .put("razorpay_order_id", req.getRazorpayOrderId())
                        .put("razorpay_payment_id", req.getRazorpayPaymentId())
                        .put("razorpay_signature", req.getRazorpaySignature()),
                keySecret
        );

        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepo.save(payment);
            throw new RuntimeException("Payment verification failed — invalid signature");
        }

        payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());

        return paymentRepo.save(payment);
    }

    // Get payment by booking ID
    public Payment getPaymentByBookingId(String email, Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isUser = booking.getUser().getEmail().equals(email);
        boolean isProvider = booking.getProvider().getEmail().equals(email);

        if (!isUser && !isProvider) {
            throw new AccessDeniedException("You are not part of this booking");
        }

        return paymentRepo.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}