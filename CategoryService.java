/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 */
package com.evdealer.manufacturer.service;

import com.evdealer.manufacturer.model.dto.CategoryRequest;
import com.evdealer.manufacturer.model.dto.CategoryResponse;
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
}
