/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 *  jakarta.persistence.UniqueConstraint
 *  jakarta.validation.constraints.DecimalMin
 *  jakarta.validation.constraints.Min
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.NotNull
 */
package com.evdealer.manufacturer.model.entity;

import com.evdealer.manufacturer.model.entity.ProductCategory;
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
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="products", uniqueConstraints={@UniqueConstraint(columnNames={"model_name", "version", "color"})})
public class Product
implements Serializable {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message="Model name is required")
    @Column(name="model_name", nullable=false)
    private @NotBlank(message="Model name is required") String modelName;
    @NotBlank(message="Version is required")
    @Column(nullable=false)
    private @NotBlank(message="Version is required") String version;
    @NotBlank(message="Color is required")
    @Column(nullable=false)
    private @NotBlank(message="Color is required") String color;
    @NotNull(message="Wholesale price is required")
    @DecimalMin(value="0.0", inclusive=false, message="Price must be greater than 0")
    @Column(name="wholesale_price", nullable=false, precision=12, scale=2)
    private @NotNull(message="Wholesale price is required") @DecimalMin(value="0.0", inclusive=false, message="Price must be greater than 0") BigDecimal wholesalePrice;
    @NotNull(message="Inventory is required")
    @Min(value=0L, message="Inventory cannot be negative")
    @Column(name="total_inventory", nullable=false)
    private @NotNull(message="Inventory is required") @Min(value=0L, message="Inventory cannot be negative") Integer totalInventory;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false)
    private ProductStatus status = ProductStatus.ACTIVE;
    @Column(columnDefinition="TEXT")
    private String specifications;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="category_id")
    private ProductCategory category;
    @Column(name="created_at")
    private LocalDateTime createdAt;
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public Product() {
    }

    public Product(String modelName, String version, String color, BigDecimal wholesalePrice, Integer totalInventory, String specifications) {
        this.modelName = modelName;
        this.version = version;
        this.color = color;
        this.wholesalePrice = wholesalePrice;
        this.totalInventory = totalInventory;
        this.specifications = specifications;
    }

    public Product(String modelName, String version, String color, BigDecimal wholesalePrice, Integer totalInventory, String specifications, ProductCategory category) {
        this.modelName = modelName;
        this.version = version;
        this.color = color;
        this.wholesalePrice = wholesalePrice;
        this.totalInventory = totalInventory;
        this.specifications = specifications;
        this.category = category;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
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
