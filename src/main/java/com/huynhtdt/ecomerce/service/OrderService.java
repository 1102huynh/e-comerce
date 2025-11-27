package com.huynhtdt.ecomerce.service;

import com.huynhtdt.ecomerce.dto.CheckoutRequest;
import com.huynhtdt.ecomerce.entity.Order;
import java.util.List;

public interface OrderService {
    List<Order> getUserOrders();
    Order getOrderById(Long id);
    Order createOrder(CheckoutRequest request);
    Order updateOrderStatus(Long id, String status);
}
