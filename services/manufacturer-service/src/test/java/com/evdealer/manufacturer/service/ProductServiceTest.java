package com.evdealer.manufacturer.service;

import com.evdealer.manufacturer.model.dto.ProductRequest;
import com.evdealer.manufacturer.model.dto.ProductResponse;
import com.evdealer.manufacturer.model.entity.Product;
import com.evdealer.manufacturer.exception.ResourceNotFoundException;
import com.evdealer.manufacturer.repository.ProductRepository;
import com.evdealer.manufacturer.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductRequest productRequest;
    private Product product;

    @BeforeEach
    void setUp() {
        productRequest = new ProductRequest();
        productRequest.setModelName("Model X");
        productRequest.setVersion("Standard");
        productRequest.setColor("Red");
        productRequest.setWholesalePrice(new BigDecimal("50000"));
        productRequest.setTotalInventory(100);
        productRequest.setSpecifications("{\"range\": \"400km\", \"battery\": \"75kWh\"}");

        product = new Product();
        product.setId(1L);
        product.setModelName("Model X");
        product.setVersion("Standard");
        product.setColor("Red");
        product.setWholesalePrice(new BigDecimal("50000"));
        product.setTotalInventory(100);
        product.setSpecifications("{\"range\": \"400km\", \"battery\": \"75kWh\"}");
    }

    @Test
    void createProduct_Success() {
        when(productRepository.existsByModelNameAndVersionAndColor(any(), any(), any())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(productRequest);

        assertNotNull(response);
        assertEquals("Model X", response.getModelName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById(1L);
        });
    }
}