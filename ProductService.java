/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 */
package com.evdealer.manufacturer.service;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    public ProductResponse createProduct(ProductRequest var1);

    public ProductResponse getProductById(Long var1);

    public Page<ProductResponse> getAllProducts(Pageable var1);

    public List<ProductResponse> getActiveProducts();

    public ProductResponse updateProduct(Long var1, ProductRequest var2);

    public void discontinueProduct(Long var1);

    public ProductResponse updateInventory(Long var1, Integer var2);

    public List<ProductResponse> searchProducts(String var1, BigDecimal var2, BigDecimal var3, Product.ProductStatus var4, Long var5);

    public List<ProductResponse> getProductsByCategory(Long var1);
}
