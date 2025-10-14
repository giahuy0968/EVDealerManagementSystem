package com.evdealer.manufacturer.repository;

import com.evdealer.manufacturer.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByStatus(Product.ProductStatus status);
    
    List<Product> findByModelNameContainingIgnoreCase(String modelName);
    
    Optional<Product> findByModelNameAndVersionAndColor(String modelName, String version, String color);
    
    @Query("SELECT p FROM Product p WHERE p.totalInventory < :threshold")
    List<Product> findLowInventoryProducts(@Param("threshold") Integer threshold);
    
    boolean existsByModelNameAndVersionAndColor(String modelName, String version, String color);
}