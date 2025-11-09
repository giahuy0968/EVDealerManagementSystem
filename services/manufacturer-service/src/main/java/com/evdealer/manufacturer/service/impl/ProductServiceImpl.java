package com.evdealer.manufacturer.service.impl;

import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import com.evdealer.manufacturer.model.entity.ProductCategory;
import com.evdealer.manufacturer.repository.CategoryRepository;
import com.evdealer.manufacturer.repository.ProductRepository;
import com.evdealer.manufacturer.service.ProductService;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductServiceImpl
implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest productRequest) {
        if (this.productRepository.existsByModelNameAndVersionAndColor(productRequest.getModelName(), productRequest.getVersion(), productRequest.getColor())) {
            throw new IllegalArgumentException("Product with same model, version and color already exists");
        }
        ProductCategory category = null;
        if (productRequest.getCategoryId() != null) {
            category = (ProductCategory)this.categoryRepository.findById(productRequest.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + String.valueOf(productRequest.getCategoryId())));
        }
        Product product = new Product();
        product.setModelName(productRequest.getModelName());
        product.setVersion(productRequest.getVersion());
        product.setColor(productRequest.getColor());
        product.setWholesalePrice(productRequest.getWholesalePrice());
        product.setTotalInventory(productRequest.getTotalInventory());
        product.setSpecifications(productRequest.getSpecifications());
        product.setCategory(category);
        Product savedProduct = (Product)this.productRepository.save(product);
        return new ProductResponse(savedProduct);
    }

    @Override
    @Transactional(readOnly=true)
    @Cacheable(value={"products"}, key="#id")
    public ProductResponse getProductById(Long id) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + String.valueOf(id)));
        return new ProductResponse(product);
    }

    @Override
    @Transactional(readOnly=true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return this.productRepository.findAll(pageable).map(ProductResponse::new);
    }

    @Override
    @Transactional(readOnly=true)
    @Cacheable(value={"activeProducts"})
    public List<ProductResponse> getActiveProducts() {
        return this.productRepository.findByStatus(Product.ProductStatus.ACTIVE).stream().map(ProductResponse::new).collect(Collectors.toList());
    }

    @Override
    @CacheEvict(value={"products", "activeProducts"}, key="#id")
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + String.valueOf(id)));
        this.productRepository.findByModelNameAndVersionAndColor(productRequest.getModelName(), productRequest.getVersion(), productRequest.getColor()).ifPresent(existingProduct -> {
            if (!existingProduct.getId().equals(id)) {
                throw new IllegalArgumentException("Product with same model, version and color already exists");
            }
        });
        ProductCategory category = null;
        if (productRequest.getCategoryId() != null) {
            category = (ProductCategory)this.categoryRepository.findById(productRequest.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + String.valueOf(productRequest.getCategoryId())));
        }
        product.setModelName(productRequest.getModelName());
        product.setVersion(productRequest.getVersion());
        product.setColor(productRequest.getColor());
        product.setWholesalePrice(productRequest.getWholesalePrice());
        product.setTotalInventory(productRequest.getTotalInventory());
        product.setSpecifications(productRequest.getSpecifications());
        product.setCategory(category);
        Product updatedProduct = (Product)this.productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    @Override
    @CacheEvict(value={"products", "activeProducts"}, key="#id")
    public void discontinueProduct(Long id) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + String.valueOf(id)));
        product.setStatus(Product.ProductStatus.DISCONTINUED);
        this.productRepository.save(product);
    }

    @Override
    @CacheEvict(value={"products", "activeProducts"}, key="#id")
    public ProductResponse updateInventory(Long id, Integer newInventory) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + String.valueOf(id)));
        if (newInventory < 0) {
            throw new IllegalArgumentException("Inventory cannot be negative");
        }
        product.setTotalInventory(newInventory);
        Product updatedProduct = (Product)this.productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    @Override
    @Transactional(readOnly=true)
    public List<ProductResponse> searchProducts(String keyword, BigDecimal minPrice, BigDecimal maxPrice, Product.ProductStatus status, Long categoryId) {
        return this.productRepository.findAdvancedSearch(keyword, minPrice, maxPrice, status, categoryId).stream().map(ProductResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly=true)
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return this.productRepository.findByCategoryId(categoryId).stream().map(ProductResponse::new).collect(Collectors.toList());
    }
}
