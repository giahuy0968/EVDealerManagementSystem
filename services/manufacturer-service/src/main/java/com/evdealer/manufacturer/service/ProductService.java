package com.evdealer.manufacturer.service;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest productRequest);
    ProductResponse getProductById(Long id);
    Page<ProductResponse> getAllProducts(Pageable pageable);
    List<ProductResponse> getActiveProducts();
    ProductResponse updateProduct(Long id, ProductRequest productRequest);
    void discontinueProduct(Long id); // <--- SỬA ĐỔI: Đổi tên thành discontinueProduct
    ProductResponse updateInventory(Long id, Integer newInventory);
    List<ProductResponse> searchProducts(String keyword, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, com.evdealer.manufacturer.model.entity.Product.ProductStatus status, Long categoryId);
    List<ProductResponse> getProductsByCategory(Long categoryId);
}
