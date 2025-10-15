package com.evdealer.manufacturer.controller;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired; // Giữ lại import, nhưng nên dùng Constructor Injection
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService; // <--- SỬA ĐỔI: Dùng final

    // <--- SỬA ĐỔI: Constructor Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    // Bỏ @Autowired trên field productService (nếu có)

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse response = productService.createProduct(productRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
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

    // <--- SỬA ĐỔI: Thay thế DELETE bằng PATCH để làm rõ Soft Delete
    @PatchMapping("/{id}/discontinue") // Đổi từ DELETE /{id} thành PATCH /{id}/discontinue
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
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam String keyword) {
        List<ProductResponse> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }
}