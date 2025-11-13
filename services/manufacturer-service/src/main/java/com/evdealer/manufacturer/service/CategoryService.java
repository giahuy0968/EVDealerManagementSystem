package com.evdealer.manufacturer.service;

import com.evdealer.manufacturer.model.dto.CategoryRequest;
import com.evdealer.manufacturer.model.dto.CategoryResponse;
<<<<<<< HEAD
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    public CategoryResponse createCategory(CategoryRequest var1);

    public CategoryResponse getCategoryById(Long var1);

    public Page<CategoryResponse> getAllCategories(Pageable var1);

    public List<CategoryResponse> getAllCategories();

    public CategoryResponse updateCategory(Long var1, CategoryRequest var2);

    public void deleteCategory(Long var1);
=======
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest);
    CategoryResponse getCategoryById(Long id);
    Page<CategoryResponse> getAllCategories(Pageable pageable);
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest);
    void deleteCategory(Long id);
>>>>>>> HoangPhuc
}
