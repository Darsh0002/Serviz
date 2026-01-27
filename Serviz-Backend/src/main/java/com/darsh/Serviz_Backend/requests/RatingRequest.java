package com.darsh.Serviz_Backend.requests;

import lombok.Data;

@Data
public class RatingRequest {
    private Long requestId;
    private int score;
    private String review;
}
