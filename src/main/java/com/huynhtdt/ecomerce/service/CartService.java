package com.huynhtdt.ecomerce.service;

import com.huynhtdt.ecomerce.dto.CartItemRequest;
import com.huynhtdt.ecomerce.entity.CartItem;
import java.util.List;

public interface CartService {
    List<CartItem> getCart();
    CartItem addToCart(CartItemRequest request);
    void removeFromCart(Long productId);
    void clearCart();
}
