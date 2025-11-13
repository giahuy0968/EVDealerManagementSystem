package com.evdms.customerservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EventPublisher {
    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public EventPublisher(@Autowired(required = false) RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        if (rabbitTemplate == null) {
            log.warn("RabbitMQ is not configured. Events will be logged but not published.");
        }
    }

    public void publish(String routingKey, Map<String, Object> payload) {
        if (rabbitTemplate != null) {
            rabbitTemplate.convertAndSend("", routingKey, payload); // default exchange, routingKey as queue name
        } else {
            log.info("Event published (no-op): routing_key={}, payload={}", routingKey, payload);
        }
    }
}
