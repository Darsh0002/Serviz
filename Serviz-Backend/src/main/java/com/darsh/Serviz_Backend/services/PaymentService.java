package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.Booking;
import com.darsh.Serviz_Backend.modals.BookingStatus;
import com.darsh.Serviz_Backend.modals.Payment;
import com.darsh.Serviz_Backend.modals.PaymentStatus;
import com.darsh.Serviz_Backend.repositories.BookingRepo;
import com.darsh.Serviz_Backend.repositories.PaymentRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepo paymentRepo;
    @Autowired
    private BookingRepo bookingRepo;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public Map<String, Object> createOrder(Long bookingId) throws Exception {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow();

        boolean alreadyPaid = paymentRepo
                .existsByBookingIdAndStatus(
                        bookingId,
                        PaymentStatus.SUCCESS
                );

        if (alreadyPaid) {
            throw new RuntimeException("Already Paid");
        }

        RazorpayClient client =
                new RazorpayClient(keyId, keySecret);

        int amountInPaise =
                (int) Math.round(booking.getPrice() * 100);

        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", "txn_" + bookingId);

        Order order = client.orders.create(options);

        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));

        return response;
    }

    @Transactional
    public String verifyPayment(Map<String, String> data)
            throws Exception {

        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        String payload = orderId + "|" + paymentId;
        String generatedSignature =
                Utils.getHash(payload, keySecret);

        if (!generatedSignature.equals(signature)) {
            return "Payment Failed";
        }

        Long bookingId = Long.parseLong(data.get("bookingId"));

        // Prevent duplicate insert
        boolean alreadyPaid = paymentRepo
                .existsByBookingIdAndStatus(
                        bookingId,
                        PaymentStatus.SUCCESS
                );

        if (alreadyPaid) {
            return "Already Paid";
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow();

        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setRazorpayOrderId(orderId);
        payment.setRazorpayPaymentId(paymentId);
        payment.setAmount(Double.valueOf(booking.getPrice()));
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setCreatedAt(LocalDateTime.now());

        paymentRepo.save(payment);

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCompletedAt(LocalDateTime.now());
        bookingRepo.save(booking);

        return "Payment Verified";
    }

}
