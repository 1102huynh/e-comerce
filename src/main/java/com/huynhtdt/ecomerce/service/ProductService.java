package com.huynhtdt.ecomerce.service;

import com.huynhtdt.ecomerce.dto.ProductRequest;
import com.huynhtdt.ecomerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<Product> getAllProducts(Pageable pageable);
    Product getProductById(Long id);
    Page<Product> searchProducts(String keyword, Pageable pageable);
    Page<Product> getProductsByCategory(Long categoryId, Pageable pageable);
    Product createProduct(ProductRequest request);
    Product updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
