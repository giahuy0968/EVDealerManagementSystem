package com.evdms.customerservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Map;

/**
 * No-op implementation of EventPublisher used when RabbitMQ is not available.
 * Logs events instead of publishing them to message queue.
 */
// NOTE: Not a Spring bean anymore. Kept only for reference.
public class NoOpEventPublisher extends EventPublisher {
    private static final Logger log = LoggerFactory.getLogger(NoOpEventPublisher.class);

    public NoOpEventPublisher() {
        super(null); // Pass null since we won't use RabbitTemplate
    }

    @Override
    public void publish(String routingKey, Map<String, Object> payload) {
        log.info("Event published (no-op): routing_key={}, payload={}", routingKey, payload);
    }
}
