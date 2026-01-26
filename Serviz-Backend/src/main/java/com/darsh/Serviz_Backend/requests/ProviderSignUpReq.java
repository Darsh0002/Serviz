package com.darsh.Serviz_Backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProviderSignUpReq {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String password;
    private String role;
    private String serviceType;
}
