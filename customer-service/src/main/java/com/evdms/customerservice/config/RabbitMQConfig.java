package com.evdms.customerservice.config;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "spring.rabbitmq.enabled", havingValue = "true", matchIfMissing = false)
public class RabbitMQConfig {

    // Declare queues used as routing keys on default exchange
    @Bean
    public Queue customerCreatedQueue() {
        return new Queue("customer.created", true);
    }

    @Bean
    public Queue testDriveScheduledQueue() {
        return new Queue("test_drive.scheduled", true);
    }

    @Bean
    public Queue testDriveReminderQueue() {
        return new Queue("test_drive.reminder", true);
    }

    @Bean
    public Queue feedbackReceivedQueue() {
        return new Queue("feedback.received", true);
    }

    @Bean
    public Queue complaintCreatedQueue() {
        return new Queue("complaint.created", true);
    }

    @Bean
    public Queue leadConvertedQueue() {
        return new Queue("lead.converted", true);
    }

    // Ensure queues are auto-declared on startup
    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        RabbitAdmin admin = new RabbitAdmin(connectionFactory);
        // Avoid startup failure when RabbitMQ is not available (e.g., local dev)
        admin.setAutoStartup(false);
        return admin;
    }

    // Use JSON for message payloads
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
