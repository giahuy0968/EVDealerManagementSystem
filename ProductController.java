/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  jakarta.validation.Valid
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.data.domain.Sort$Direction
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.evdealer.manufacturer.controller;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import com.evdealer.manufacturer.service.ProductService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/v1/products"})
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse response = this.productService.createProduct(productRequest);
        return new ResponseEntity((Object)response, (HttpStatusCode)HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size, @RequestParam(defaultValue="createdAt") String sortBy, @RequestParam(defaultValue="desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageable = PageRequest.of((int)page, (int)size, (Sort)Sort.by((Sort.Direction)direction, (String[])new String[]{sortBy}));
        Page<ProductResponse> products = this.productService.getAllProducts((Pageable)pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping(value={"/active"})
    public ResponseEntity<List<ProductResponse>> getActiveProducts() {
        List<ProductResponse> products = this.productService.getActiveProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping(value={"/{id}"})
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = this.productService.getProductById(id);
        return ResponseEntity.ok((Object)product);
    }

    @PutMapping(value={"/{id}"})
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest productRequest) {
        ProductResponse response = this.productService.updateProduct(id, productRequest);
        return ResponseEntity.ok((Object)response);
    }

    @PatchMapping(value={"/{id}/discontinue"})
    public ResponseEntity<Void> discontinueProduct(@PathVariable Long id) {
        this.productService.discontinueProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value={"/{id}/inventory"})
    public ResponseEntity<ProductResponse> updateInventory(@PathVariable Long id, @RequestParam Integer inventory) {
        ProductResponse response = this.productService.updateInventory(id, inventory);
        return ResponseEntity.ok((Object)response);
    }

    @GetMapping(value={"/search"})
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam(required=false) String keyword, @RequestParam(required=false) BigDecimal minPrice, @RequestParam(required=false) BigDecimal maxPrice, @RequestParam(required=false) String status, @RequestParam(required=false) Long categoryId) {
        Product.ProductStatus productStatus = null;
        if (status != null) {
            try {
                productStatus = Product.ProductStatus.valueOf(status.toUpperCase());
            }
            catch (IllegalArgumentException illegalArgumentException) {
                // empty catch block
            }
        }
        List<ProductResponse> products = this.productService.searchProducts(keyword, minPrice, maxPrice, productStatus, categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping(value={"/category/{categoryId}"})
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductResponse> products = this.productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
}
