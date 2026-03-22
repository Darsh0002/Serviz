package com.darsh.Serviz_Backend.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private String razorpayOrderId;
    private Long amount;
    private String currency;
    private String keyId;
}
