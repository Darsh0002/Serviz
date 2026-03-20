package com.darsh.Serviz_Backend.requests;

import lombok.Data;

@Data
public class BidReq {
    private Long requestId;
    private Long price;
    private Integer estimatedTimeInHours;
    private String message;
}
