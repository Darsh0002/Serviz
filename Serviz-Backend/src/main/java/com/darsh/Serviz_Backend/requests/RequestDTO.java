package com.darsh.Serviz_Backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestDTO {
    private String serviceType;
    private String address;
    private String city;
    private String description;
}
