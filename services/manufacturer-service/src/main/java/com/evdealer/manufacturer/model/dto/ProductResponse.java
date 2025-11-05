package com.evdealer.manufacturer.model.dto;

import com.evdealer.manufacturer.model.entity.Product;
import java.io.Serializable; // <--- SỬA ĐỔI: Thêm Serializable
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse implements Serializable { // <--- SỬA ĐỔI: implements Serializable
    private Long id;
    private String modelName;
    private String version;
    private String color;
    private BigDecimal wholesalePrice;
    private Integer totalInventory;
    private Product.ProductStatus status;
    private String specifications;
    private CategoryResponse category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor from Entity
    public ProductResponse(Product product) {
        this.id = product.getId();
        this.modelName = product.getModelName();
        this.version = product.getVersion();
        this.color = product.getColor();
        this.wholesalePrice = product.getWholesalePrice();
        this.totalInventory = product.getTotalInventory();
        this.status = product.getStatus();
        this.specifications = product.getSpecifications();
        if (product.getCategory() != null) {
            this.category = new CategoryResponse(product.getCategory());
        }
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }

    // Default constructor
    public ProductResponse() {}

    // Getters and Setters (Giữ nguyên)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getWholesalePrice() { return wholesalePrice; }
    public void setWholesalePrice(BigDecimal wholesalePrice) { this.wholesalePrice = wholesalePrice; }

    public Integer getTotalInventory() { return totalInventory; }
    public void setTotalInventory(Integer totalInventory) { this.totalInventory = totalInventory; }

    public Product.ProductStatus getStatus() { return status; }
    public void setStatus(Product.ProductStatus status) { this.status = status; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}