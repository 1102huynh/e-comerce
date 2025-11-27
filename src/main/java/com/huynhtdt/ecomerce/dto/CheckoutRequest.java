package com.huynhtdt.ecomerce.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String shippingAddress;
    private String phone;
}

