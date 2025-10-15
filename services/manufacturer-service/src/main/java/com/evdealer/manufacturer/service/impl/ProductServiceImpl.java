package com.evdealer.manufacturer.service.impl;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.repository.ProductRepository;
import com.evdealer.manufacturer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired; // Giữ lại import, nhưng không dùng

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository; // <--- SỬA ĐỔI: Dùng final

    // <--- SỬA ĐỔI: Constructor Injection
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest productRequest) {
        // Check if product already exists
        if (productRepository.existsByModelNameAndVersionAndColor(
                productRequest.getModelName(), 
                productRequest.getVersion(), 
                productRequest.getColor())) {
            throw new IllegalArgumentException("Product with same model, version and color already exists");
        }

        Product product = new Product();
        product.setModelName(productRequest.getModelName());
        product.setVersion(productRequest.getVersion());
        product.setColor(productRequest.getColor());
        product.setWholesalePrice(productRequest.getWholesalePrice());
        product.setTotalInventory(productRequest.getTotalInventory());
        product.setSpecifications(productRequest.getSpecifications());

        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return new ProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Logic kiểm tra trùng lặp (Giữ nguyên)
        productRepository.findByModelNameAndVersionAndColor(
            productRequest.getModelName(), 
            productRequest.getVersion(), 
            productRequest.getColor())
            .ifPresent(existingProduct -> {
                if (!existingProduct.getId().equals(id)) {
                    throw new IllegalArgumentException("Product with same model, version and color already exists");
                }
            });

        product.setModelName(productRequest.getModelName());
        product.setVersion(productRequest.getVersion());
        product.setColor(productRequest.getColor());
        product.setWholesalePrice(productRequest.getWholesalePrice());
        product.setTotalInventory(productRequest.getTotalInventory());
        product.setSpecifications(productRequest.getSpecifications());

        Product updatedProduct = productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    @Override
    public void discontinueProduct(Long id) { // <--- SỬA ĐỔI: Triển khai phương thức đổi tên
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setStatus(Product.ProductStatus.DISCONTINUED);
        productRepository.save(product);
    }

    @Override
    public ProductResponse updateInventory(Long id, Integer newInventory) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (newInventory < 0) {
            throw new IllegalArgumentException("Inventory cannot be negative");
        }

        product.setTotalInventory(newInventory);
        Product updatedProduct = productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.findByModelNameContainingIgnoreCase(keyword).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
}