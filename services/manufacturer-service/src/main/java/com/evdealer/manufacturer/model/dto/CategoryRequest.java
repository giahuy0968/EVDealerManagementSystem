package com.evdealer.manufacturer.model.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {
<<<<<<< HEAD
    @NotBlank(message="Name is required")
    private String name;
    private String description;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
=======

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
>>>>>>> HoangPhuc
}
