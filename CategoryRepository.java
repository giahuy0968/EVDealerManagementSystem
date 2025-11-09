/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.evdealer.manufacturer.repository;

import com.evdealer.manufacturer.model.entity.ProductCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository
extends JpaRepository<ProductCategory, Long> {
    public Optional<ProductCategory> findByName(String var1);

    public boolean existsByName(String var1);
}
