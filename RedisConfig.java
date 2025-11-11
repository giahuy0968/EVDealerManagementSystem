/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.context.annotation.Bean
 *  org.springframework.context.annotation.Configuration
 *  org.springframework.data.redis.connection.RedisConnectionFactory
 *  org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
 *  org.springframework.data.redis.core.RedisTemplate
 *  org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer
 *  org.springframework.data.redis.serializer.RedisSerializer
 *  org.springframework.data.redis.serializer.StringRedisSerializer
 */
package com.evdealer.manufacturer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate template = new RedisTemplate();
        template.setConnectionFactory(this.redisConnectionFactory());
        template.setKeySerializer((RedisSerializer)new StringRedisSerializer());
        template.setValueSerializer((RedisSerializer)new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer((RedisSerializer)new StringRedisSerializer());
        template.setHashValueSerializer((RedisSerializer)new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
