package com.huynhtdt.ecomerce.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Data
    @AllArgsConstructor
    public static class AuthResponse {
        private String status;
        private String principal;
        private String name;
        private Collection<? extends GrantedAuthority> authorities;
        private boolean isAuthenticated;
    }

    @Data
    @AllArgsConstructor
    public static class TokenResponse {
        private String authorizationHeader;
        private String headerValue;
    }

    @GetMapping("/auth")
    public ResponseEntity<?> checkAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            return ResponseEntity.ok("❌ Authentication is NULL");
        }

        return ResponseEntity.ok(new AuthResponse(
            "✅ Authenticated",
            auth.getPrincipal().toString(),
            auth.getName(),
            auth.getAuthorities(),
            auth.isAuthenticated()
        ));
    }

    @GetMapping("/token")
    public ResponseEntity<?> checkToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        return ResponseEntity.ok(new TokenResponse(
            authHeader != null ? "✅ Present" : "❌ Missing",
            authHeader
        ));
    }
}

