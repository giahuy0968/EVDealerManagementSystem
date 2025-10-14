package com.evdealer.manufacturer.service.impl;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.repository.ProductRepository;
import com.evdealer.manufacturer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    @CacheEvict(value = {"products", "activeProducts"}, allEntries = true)
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
    @Cacheable(value = "product", key = "#id")
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return new ProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products")
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "activeProducts")
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @CacheEvict(value = {"product", "products", "activeProducts"}, allEntries = true)
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

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
    @CacheEvict(value = {"product", "products", "activeProducts"}, allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setStatus(Product.ProductStatus.DISCONTINUED);
        productRepository.save(product);
    }

    @Override
    @CacheEvict(value = {"product", "products", "activeProducts"}, allEntries = true)
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