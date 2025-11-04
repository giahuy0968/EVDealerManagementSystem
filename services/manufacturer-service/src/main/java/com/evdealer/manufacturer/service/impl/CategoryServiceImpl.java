package com.evdealer.manufacturer.service.impl;

import com.evdealer.manufacturer.model.dto.CategoryRequest;
import com.evdealer.manufacturer.model.dto.CategoryResponse;
import com.evdealer.manufacturer.model.entity.ProductCategory;
import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.repository.CategoryRepository;
import com.evdealer.manufacturer.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new IllegalArgumentException("Category with name '" + categoryRequest.getName() + "' already exists");
        }

        ProductCategory category = new ProductCategory();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        ProductCategory savedCategory = categoryRepository.save(category);
        return new CategoryResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return new CategoryResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(CategoryResponse::new);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Check if name is being changed and if it conflicts
        if (!category.getName().equals(categoryRequest.getName()) &&
            categoryRepository.existsByName(categoryRequest.getName())) {
            throw new IllegalArgumentException("Category with name '" + categoryRequest.getName() + "' already exists");
        }

        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        ProductCategory updatedCategory = categoryRepository.save(category);
        return new CategoryResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
