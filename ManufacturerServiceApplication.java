/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.boot.SpringApplication
 *  org.springframework.boot.autoconfigure.SpringBootApplication
 *  org.springframework.cache.annotation.EnableCaching
 */
package com.evdealer.manufacturer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ManufacturerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ManufacturerServiceApplication.class, (String[])args);
    }
}
