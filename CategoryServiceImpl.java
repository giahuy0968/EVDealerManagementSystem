/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.evdealer.manufacturer.service.impl;

import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.model.dto.CategoryRequest;
import com.evdealer.manufacturer.model.dto.CategoryResponse;
import com.evdealer.manufacturer.model.entity.ProductCategory;
import com.evdealer.manufacturer.repository.CategoryRepository;
import com.evdealer.manufacturer.service.CategoryService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryServiceImpl
implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        if (this.categoryRepository.existsByName(categoryRequest.getName())) {
            throw new IllegalArgumentException("Category with name '" + categoryRequest.getName() + "' already exists");
        }
        ProductCategory category = new ProductCategory();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        ProductCategory savedCategory = (ProductCategory)this.categoryRepository.save(category);
        return new CategoryResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly=true)
    public CategoryResponse getCategoryById(Long id) {
        ProductCategory category = (ProductCategory)this.categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + String.valueOf(id)));
        return new CategoryResponse(category);
    }

    @Override
    @Transactional(readOnly=true)
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        return this.categoryRepository.findAll(pageable).map(CategoryResponse::new);
    }

    @Override
    @Transactional(readOnly=true)
    public List<CategoryResponse> getAllCategories() {
        return this.categoryRepository.findAll().stream().map(CategoryResponse::new).collect(Collectors.toList());
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        ProductCategory category = (ProductCategory)this.categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + String.valueOf(id)));
        if (!category.getName().equals(categoryRequest.getName()) && this.categoryRepository.existsByName(categoryRequest.getName())) {
            throw new IllegalArgumentException("Category with name '" + categoryRequest.getName() + "' already exists");
        }
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        ProductCategory updatedCategory = (ProductCategory)this.categoryRepository.save(category);
        return new CategoryResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!this.categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + String.valueOf(id));
        }
        this.categoryRepository.deleteById(id);
    }
}
