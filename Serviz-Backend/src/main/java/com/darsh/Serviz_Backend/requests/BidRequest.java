package com.darsh.Serviz_Backend.requests;

import lombok.Data;

@Data
public class BidRequest {
    Long requestId;
    Long price;
    String message;
}
