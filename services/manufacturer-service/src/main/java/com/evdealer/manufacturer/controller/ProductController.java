package com.evdealer.manufacturer.controller;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService; 

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse response = productService.createProduct(productRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ProductResponse> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ProductResponse>> getActiveProducts() {
        List<ProductResponse> products = productService.getActiveProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody ProductRequest productRequest) {
        ProductResponse response = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(response);
    }

   
    @PatchMapping("/{id}/discontinue") 
    public ResponseEntity<Void> discontinueProduct(@PathVariable Long id) {
        productService.discontinueProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/inventory")
    public ResponseEntity<ProductResponse> updateInventory(
            @PathVariable Long id, 
            @RequestParam Integer inventory) {
        ProductResponse response = productService.updateInventory(id, inventory);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId) {
        com.evdealer.manufacturer.model.entity.Product.ProductStatus productStatus = null;
        if (status != null) {
            try {
                productStatus = com.evdealer.manufacturer.model.entity.Product.ProductStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore or handle
            }
        }
        List<ProductResponse> products = productService.searchProducts(keyword, minPrice, maxPrice, productStatus, categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
}