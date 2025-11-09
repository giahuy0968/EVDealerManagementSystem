package com.evdealer.manufacturer.model.entity;

<<<<<<< HEAD
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
=======
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable; // <--- SỬA ĐỔI: Thêm import Serializable
>>>>>>> HoangPhuc
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
<<<<<<< HEAD
@Table(name="products")
public class Product {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String modelName;
    @Column(nullable=false)
    private String version;
    @Column(nullable=false)
    private String color;
    @Column(nullable=false, precision=10, scale=2)
    private BigDecimal wholesalePrice;
    @Column(nullable=false)
    private Integer totalInventory;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false)
    private ProductStatus status;
    private String specifications;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="category_id")
    private ProductCategory category;
    @Column(nullable=false)
    private LocalDateTime createdAt;
    @Column(nullable=false)
    private LocalDateTime updatedAt;

    public Product() {
=======
@Table(name = "products", uniqueConstraints = { // <--- SỬA ĐỔI: Thêm Unique Constraint
    @UniqueConstraint(columnNames = {"model_name", "version", "color"})
})
public class Product implements Serializable { // <--- SỬA ĐỔI: implements Serializable
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Model name is required")
    @Column(name = "model_name", nullable = false)
    private String modelName;

    @NotBlank(message = "Version is required")
    @Column(nullable = false)
    private String version;

    @NotBlank(message = "Color is required")
    @Column(nullable = false)
    private String color;

    @NotNull(message = "Wholesale price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "wholesale_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal wholesalePrice;

    @NotNull(message = "Inventory is required")
    @Min(value = 0, message = "Inventory cannot be negative")
    @Column(name = "total_inventory", nullable = false)
    private Integer totalInventory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum ProductStatus {
        ACTIVE, DISCONTINUED, COMING_SOON
    }

    // Constructors
    public Product() {}

    public Product(String modelName, String version, String color,
                  BigDecimal wholesalePrice, Integer totalInventory,
                  String specifications) {
        this.modelName = modelName;
        this.version = version;
        this.color = color;
        this.wholesalePrice = wholesalePrice;
        this.totalInventory = totalInventory;
        this.specifications = specifications;
    }

    public Product(String modelName, String version, String color,
                  BigDecimal wholesalePrice, Integer totalInventory,
                  String specifications, ProductCategory category) {
        this.modelName = modelName;
        this.version = version;
        this.color = color;
        this.wholesalePrice = wholesalePrice;
        this.totalInventory = totalInventory;
        this.specifications = specifications;
        this.category = category;
>>>>>>> HoangPhuc
    }

    @PrePersist
    protected void onCreate() {
<<<<<<< HEAD
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ProductStatus.ACTIVE;
        }
=======
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
>>>>>>> HoangPhuc
    }

    @PreUpdate
    protected void onUpdate() {
<<<<<<< HEAD
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModelName() {
        return this.modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getWholesalePrice() {
        return this.wholesalePrice;
    }

    public void setWholesalePrice(BigDecimal wholesalePrice) {
        this.wholesalePrice = wholesalePrice;
    }

    public Integer getTotalInventory() {
        return this.totalInventory;
    }

    public void setTotalInventory(Integer totalInventory) {
        this.totalInventory = totalInventory;
    }

    public ProductStatus getStatus() {
        return this.status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public String getSpecifications() {
        return this.specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public ProductCategory getCategory() {
        return this.category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static enum ProductStatus {
        ACTIVE,
        DISCONTINUED,
        COMING_SOON;

    }
}
=======
        updatedAt = LocalDateTime.now();
    }

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

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public ProductCategory getCategory() { return category; }
    public void setCategory(ProductCategory category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
>>>>>>> HoangPhuc
