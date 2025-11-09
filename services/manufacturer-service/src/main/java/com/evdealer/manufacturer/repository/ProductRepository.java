package com.evdealer.manufacturer.repository;

import com.evdealer.manufacturer.model.entity.Product;
<<<<<<< HEAD
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
=======
>>>>>>> HoangPhuc
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
public interface ProductRepository
extends JpaRepository<Product, Long> {
    public List<Product> findByStatus(Product.ProductStatus var1);

    public List<Product> findByModelNameContainingIgnoreCase(String var1);

    public Optional<Product> findByModelNameAndVersionAndColor(String var1, String var2, String var3);

    @Query(value="SELECT p FROM Product p WHERE p.totalInventory < :threshold")
    public List<Product> findLowInventoryProducts(@Param(value="threshold") Integer var1);

    public boolean existsByModelNameAndVersionAndColor(String var1, String var2, String var3);

    public List<Product> findByCategoryId(Long var1);

    @Query(value="SELECT p FROM Product p WHERE (:keyword IS NULL OR LOWER(p.modelName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.specifications) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:minPrice IS NULL OR p.wholesalePrice >= :minPrice) AND (:maxPrice IS NULL OR p.wholesalePrice <= :maxPrice) AND (:status IS NULL OR p.status = :status) AND (:categoryId IS NULL OR p.category.id = :categoryId)")
    public List<Product> findAdvancedSearch(@Param(value="keyword") String var1, @Param(value="minPrice") BigDecimal var2, @Param(value="maxPrice") BigDecimal var3, @Param(value="status") Product.ProductStatus var4, @Param(value="categoryId") Long var5);
=======
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

    List<Product> findByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE " +
           "(:keyword IS NULL OR LOWER(p.modelName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.specifications) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:minPrice IS NULL OR p.wholesalePrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.wholesalePrice <= :maxPrice) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId)")
    List<Product> findAdvancedSearch(@Param("keyword") String keyword,
                                     @Param("minPrice") java.math.BigDecimal minPrice,
                                     @Param("maxPrice") java.math.BigDecimal maxPrice,
                                     @Param("status") Product.ProductStatus status,
                                     @Param("categoryId") Long categoryId);
>>>>>>> HoangPhuc
}
