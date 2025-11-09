/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  jakarta.validation.constraints.DecimalMin
 *  jakarta.validation.constraints.Min
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.NotNull
 */
package com.evdealer.manufacturer.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductRequest {
    @NotBlank(message="Model name is required")
    private @NotBlank(message="Model name is required") String modelName;
    @NotBlank(message="Version is required")
    private @NotBlank(message="Version is required") String version;
    @NotBlank(message="Color is required")
    private @NotBlank(message="Color is required") String color;
    @NotNull(message="Wholesale price is required")
    @DecimalMin(value="0.0", inclusive=false, message="Price must be greater than 0")
    private @NotNull(message="Wholesale price is required") @DecimalMin(value="0.0", inclusive=false, message="Price must be greater than 0") BigDecimal wholesalePrice;
    @NotNull(message="Inventory is required")
    @Min(value=0L, message="Inventory cannot be negative")
    private @NotNull(message="Inventory is required") @Min(value=0L, message="Inventory cannot be negative") Integer totalInventory;
    private String specifications;
    private Long categoryId;

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

    public String getSpecifications() {
        return this.specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public Long getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
