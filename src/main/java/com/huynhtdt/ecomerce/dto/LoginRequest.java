package com.huynhtdt.ecomerce.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}

