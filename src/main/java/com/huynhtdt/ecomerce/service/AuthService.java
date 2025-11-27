package com.huynhtdt.ecomerce.service;

import com.huynhtdt.ecomerce.dto.LoginRequest;
import com.huynhtdt.ecomerce.dto.RegisterRequest;
import com.huynhtdt.ecomerce.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
}
