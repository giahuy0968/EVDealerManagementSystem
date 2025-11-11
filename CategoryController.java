/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  jakarta.validation.Valid
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.data.domain.Sort$Direction
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.evdealer.manufacturer.controller;

import com.evdealer.manufacturer.model.dto.CategoryRequest;
import com.evdealer.manufacturer.model.dto.CategoryResponse;
import com.evdealer.manufacturer.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/v1/categories"})
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        CategoryResponse response = this.categoryService.createCategory(categoryRequest);
        return new ResponseEntity((Object)response, (HttpStatusCode)HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> getAllCategories(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size, @RequestParam(defaultValue="createdAt") String sortBy, @RequestParam(defaultValue="desc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageable = PageRequest.of((int)page, (int)size, (Sort)Sort.by((Sort.Direction)direction, (String[])new String[]{sortBy}));
        Page<CategoryResponse> categories = this.categoryService.getAllCategories((Pageable)pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping(value={"/all"})
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesList() {
        List<CategoryResponse> categories = this.categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping(value={"/{id}"})
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = this.categoryService.getCategoryById(id);
        return ResponseEntity.ok((Object)category);
    }

    @PutMapping(value={"/{id}"})
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest categoryRequest) {
        CategoryResponse response = this.categoryService.updateCategory(id, categoryRequest);
        return ResponseEntity.ok((Object)response);
    }

    @DeleteMapping(value={"/{id}"})
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        this.categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
