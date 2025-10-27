package com.evm.report.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    // Queue names
    public static final String ORDER_COMPLETED_QUEUE = "order.completed";
    public static final String INVENTORY_CHANGED_QUEUE = "inventory.changed";
    public static final String CUSTOMER_CREATED_QUEUE = "customer.created";
    public static final String PAYMENT_RECEIVED_QUEUE = "payment.received";
    public static final String TESTDRIVE_SCHEDULED_QUEUE = "testdrive.scheduled";
    public static final String ALLOCATION_CREATED_QUEUE = "allocation.created";
    
    @Bean
    public Queue orderCompletedQueue() {
        return new Queue(ORDER_COMPLETED_QUEUE, true);
    }
    
    @Bean
    public Queue inventoryChangedQueue() {
        return new Queue(INVENTORY_CHANGED_QUEUE, true);
    }
    
    @Bean
    public Queue customerCreatedQueue() {
        return new Queue(CUSTOMER_CREATED_QUEUE, true);
    }
    
    @Bean
    public Queue paymentReceivedQueue() {
        return new Queue(PAYMENT_RECEIVED_QUEUE, true);
    }
    
    @Bean
    public Queue testDriveScheduledQueue() {
        return new Queue(TESTDRIVE_SCHEDULED_QUEUE, true);
    }
    
    @Bean
    public Queue allocationCreatedQueue() {
        return new Queue(ALLOCATION_CREATED_QUEUE, true);
    }
    
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
