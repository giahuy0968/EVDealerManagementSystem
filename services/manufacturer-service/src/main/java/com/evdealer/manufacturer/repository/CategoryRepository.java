package com.evdealer.manufacturer.repository;

import com.evdealer.manufacturer.model.entity.ProductCategory;
<<<<<<< HEAD
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository
extends JpaRepository<ProductCategory, Long> {
    public Optional<ProductCategory> findByName(String var1);

    public boolean existsByName(String var1);
=======
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<ProductCategory, Long> {

    Optional<ProductCategory> findByName(String name);

    boolean existsByName(String name);
>>>>>>> HoangPhuc
}
