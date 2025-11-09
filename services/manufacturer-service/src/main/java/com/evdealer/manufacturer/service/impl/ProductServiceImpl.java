package com.evdealer.manufacturer.service.impl;

<<<<<<< HEAD
import com.evdealer.manufacturer.exception.ResourceNotFoundException;
=======
>>>>>>> HoangPhuc
import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import com.evdealer.manufacturer.model.entity.ProductCategory;
<<<<<<< HEAD
import com.evdealer.manufacturer.repository.CategoryRepository;
import com.evdealer.manufacturer.repository.ProductRepository;
import com.evdealer.manufacturer.service.ProductService;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
=======
import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.repository.ProductRepository;
import com.evdealer.manufacturer.repository.CategoryRepository;
import com.evdealer.manufacturer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired; // Giữ lại import, nhưng không dùng

>>>>>>> HoangPhuc
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

<<<<<<< HEAD
@Service
@Transactional
public class ProductServiceImpl
implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

=======
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository; // <--- SỬA ĐỔI: Dùng final
    private final CategoryRepository categoryRepository;

    // <--- SỬA ĐỔI: Constructor Injection
>>>>>>> HoangPhuc
    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest productRequest) {
<<<<<<< HEAD
        if (this.productRepository.existsByModelNameAndVersionAndColor(productRequest.getModelName(), productRequest.getVersion(), productRequest.getColor())) {
            throw new IllegalArgumentException("Product with same model, version and color already exists");
        }
        ProductCategory category = null;
        if (productRequest.getCategoryId() != null) {
            category = (ProductCategory)this.categoryRepository.findById(productRequest.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + String.valueOf(productRequest.getCategoryId())));
        }
=======
        // Check if product already exists
        if (productRepository.existsByModelNameAndVersionAndColor(
                productRequest.getModelName(), 
                productRequest.getVersion(), 
                productRequest.getColor())) {
            throw new IllegalArgumentException("Product with same model, version and color already exists");
        }

        ProductCategory category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productRequest.getCategoryId()));
        }

>>>>>>> HoangPhuc
        Product product = new Product();
        product.setModelName(productRequest.getModelName());
        product.setVersion(productRequest.getVersion());
        product.setColor(productRequest.getColor());
        product.setWholesalePrice(productRequest.getWholesalePrice());
        product.setTotalInventory(productRequest.getTotalInventory());
        product.setSpecifications(productRequest.getSpecifications());
        product.setCategory(category);
<<<<<<< HEAD
        Product savedProduct = (Product)this.productRepository.save(product);
=======

        Product savedProduct = productRepository.save(product);
>>>>>>> HoangPhuc
        return new ProductResponse(savedProduct);
    }

    @Override
<<<<<<< HEAD
    @Transactional(readOnly=true)
    @Cacheable(value={"products"}, key="#id")
    public ProductResponse getProductById(Long id) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + String.valueOf(id)));
=======
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
>>>>>>> HoangPhuc
        return new ProductResponse(product);
    }

    @Override
<<<<<<< HEAD
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
=======
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(ProductResponse::new);
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
    @CacheEvict(value = {"products", "activeProducts"}, key = "#id")
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

        ProductCategory category = null;
        if (productRequest.getCategoryId() != null) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productRequest.getCategoryId()));
        }

>>>>>>> HoangPhuc
        product.setModelName(productRequest.getModelName());
        product.setVersion(productRequest.getVersion());
        product.setColor(productRequest.getColor());
        product.setWholesalePrice(productRequest.getWholesalePrice());
        product.setTotalInventory(productRequest.getTotalInventory());
        product.setSpecifications(productRequest.getSpecifications());
        product.setCategory(category);
<<<<<<< HEAD
        Product updatedProduct = (Product)this.productRepository.save(product);
=======

        Product updatedProduct = productRepository.save(product);
>>>>>>> HoangPhuc
        return new ProductResponse(updatedProduct);
    }

    @Override
<<<<<<< HEAD
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
=======
    @CacheEvict(value = {"products", "activeProducts"}, key = "#id")
    public void discontinueProduct(Long id) { // <--- SỬA ĐỔI: Triển khai phương thức đổi tên
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStatus(Product.ProductStatus.DISCONTINUED);
        productRepository.save(product);
    }

    @Override
    @CacheEvict(value = {"products", "activeProducts"}, key = "#id")
    public ProductResponse updateInventory(Long id, Integer newInventory) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (newInventory < 0) {
            throw new IllegalArgumentException("Inventory cannot be negative");
        }

        product.setTotalInventory(newInventory);
        Product updatedProduct = productRepository.save(product);
>>>>>>> HoangPhuc
        return new ProductResponse(updatedProduct);
    }

    @Override
<<<<<<< HEAD
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
=======
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Product.ProductStatus status, Long categoryId) {
        return productRepository.findAdvancedSearch(keyword, minPrice, maxPrice, status, categoryId).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
}
>>>>>>> HoangPhuc
