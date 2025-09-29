// EVDMS MongoDB Initialization Script
// This script initializes the MongoDB database with collections and indexes

// Switch to EVDMS database
db = db.getSiblingDB('evdms');

// Create user for the application
db.createUser({
  user: "evdms_user",
  pwd: "evdms_password",
  roles: [
    {
      role: "readWrite",
      db: "evdms"
    }
  ]
});

// Customer Analytics Collection - stores analytics data for customers
db.createCollection('customer_analytics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "dealerId", "eventType", "timestamp"],
      properties: {
        customerId: {
          bsonType: "string",
          description: "Customer UUID from PostgreSQL"
        },
        dealerId: {
          bsonType: "string", 
          description: "Dealer UUID from PostgreSQL"
        },
        eventType: {
          bsonType: "string",
          enum: ["page_view", "vehicle_view", "test_drive_request", "quote_request", "purchase_intent"],
          description: "Type of customer interaction"
        },
        eventData: {
          bsonType: "object",
          description: "Event-specific data"
        },
        timestamp: {
          bsonType: "date",
          description: "When the event occurred"
        },
        sessionId: {
          bsonType: "string",
          description: "User session identifier"
        },
        userAgent: {
          bsonType: "string",
          description: "Browser/device information"
        },
        ipAddress: {
          bsonType: "string",
          description: "Client IP address"
        }
      }
    }
  }
});

// Sales Analytics Collection - stores sales performance data
db.createCollection('sales_analytics', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["dealerId", "period", "metrics"],
      properties: {
        dealerId: {
          bsonType: "string",
          description: "Dealer UUID from PostgreSQL"
        },
        userId: {
          bsonType: "string",
          description: "User UUID from PostgreSQL (optional for dealer-level metrics)"
        },
        period: {
          bsonType: "object",
          required: ["year", "month"],
          properties: {
            year: { bsonType: "int" },
            month: { bsonType: "int" },
            week: { bsonType: "int" },
            day: { bsonType: "int" }
          }
        },
        metrics: {
          bsonType: "object",
          required: ["sales_count", "revenue"],
          properties: {
            sales_count: { bsonType: "int" },
            revenue: { bsonType: "decimal" },
            leads_generated: { bsonType: "int" },
            test_drives_completed: { bsonType: "int" },
            conversion_rate: { bsonType: "decimal" },
            avg_deal_size: { bsonType: "decimal" }
          }
        },
        vehicleBreakdown: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              vehicleId: { bsonType: "string" },
              model: { bsonType: "string" },
              count: { bsonType: "int" },
              revenue: { bsonType: "decimal" }
            }
          }
        },
        createdAt: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

// Customer Feedback Collection - stores detailed feedback and reviews
db.createCollection('customer_feedback', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "dealerId", "type", "rating", "createdAt"],
      properties: {
        customerId: {
          bsonType: "string",
          description: "Customer UUID from PostgreSQL"
        },
        dealerId: {
          bsonType: "string",
          description: "Dealer UUID from PostgreSQL"
        },
        orderId: {
          bsonType: "string",
          description: "Order UUID from PostgreSQL (optional)"
        },
        vehicleId: {
          bsonType: "string",
          description: "Vehicle UUID from PostgreSQL (optional)"
        },
        salesRepId: {
          bsonType: "string",
          description: "Sales rep UUID from PostgreSQL (optional)"
        },
        type: {
          bsonType: "string",
          enum: ["vehicle_review", "service_review", "overall_experience", "complaint", "suggestion"],
          description: "Type of feedback"
        },
        rating: {
          bsonType: "int",
          minimum: 1,
          maximum: 5,
          description: "Rating from 1-5"
        },
        title: {
          bsonType: "string",
          description: "Feedback title"
        },
        content: {
          bsonType: "string",
          description: "Detailed feedback content"
        },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Feedback tags for categorization"
        },
        sentiment: {
          bsonType: "string",
          enum: ["positive", "neutral", "negative"],
          description: "Sentiment analysis result"
        },
        status: {
          bsonType: "string",
          enum: ["pending", "reviewed", "responded", "resolved"],
          description: "Feedback status"
        },
        response: {
          bsonType: "object",
          properties: {
            content: { bsonType: "string" },
            respondedBy: { bsonType: "string" },
            respondedAt: { bsonType: "date" }
          }
        },
        attachments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              filename: { bsonType: "string" },
              url: { bsonType: "string" },
              type: { bsonType: "string" }
            }
          }
        },
        createdAt: {
          bsonType: "date",
          description: "Feedback creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Feedback last update timestamp"
        }
      }
    }
  }
});

// AI Insights Collection - stores ML model predictions and insights
db.createCollection('ai_insights', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "modelVersion", "prediction", "confidence", "createdAt"],
      properties: {
        type: {
          bsonType: "string",
          enum: ["demand_forecast", "customer_segmentation", "churn_prediction", "price_optimization", "inventory_optimization"],
          description: "Type of AI insight"
        },
        dealerId: {
          bsonType: "string",
          description: "Dealer UUID for dealer-specific insights"
        },
        customerId: {
          bsonType: "string",
          description: "Customer UUID for customer-specific insights"
        },
        vehicleId: {
          bsonType: "string",
          description: "Vehicle UUID for vehicle-specific insights"
        },
        modelVersion: {
          bsonType: "string",
          description: "ML model version used"
        },
        prediction: {
          bsonType: "object",
          description: "Model prediction results"
        },
        confidence: {
          bsonType: "decimal",
          minimum: 0,
          maximum: 1,
          description: "Prediction confidence score"
        },
        inputFeatures: {
          bsonType: "object",
          description: "Input features used for prediction"
        },
        metadata: {
          bsonType: "object",
          description: "Additional metadata"
        },
        validUntil: {
          bsonType: "date",
          description: "When this prediction expires"
        },
        createdAt: {
          bsonType: "date",
          description: "Prediction creation timestamp"
        }
      }
    }
  }
});

// Create indexes for performance
// Customer Analytics indexes
db.customer_analytics.createIndex({ "customerId": 1, "timestamp": -1 });
db.customer_analytics.createIndex({ "dealerId": 1, "timestamp": -1 });
db.customer_analytics.createIndex({ "eventType": 1, "timestamp": -1 });
db.customer_analytics.createIndex({ "timestamp": -1 });
db.customer_analytics.createIndex({ "sessionId": 1 });

// Sales Analytics indexes
db.sales_analytics.createIndex({ "dealerId": 1, "period.year": 1, "period.month": 1 });
db.sales_analytics.createIndex({ "userId": 1, "period.year": 1, "period.month": 1 });
db.sales_analytics.createIndex({ "period.year": 1, "period.month": 1 });

// Customer Feedback indexes
db.customer_feedback.createIndex({ "customerId": 1, "createdAt": -1 });
db.customer_feedback.createIndex({ "dealerId": 1, "createdAt": -1 });
db.customer_feedback.createIndex({ "type": 1, "rating": 1 });
db.customer_feedback.createIndex({ "status": 1, "createdAt": -1 });
db.customer_feedback.createIndex({ "sentiment": 1, "rating": 1 });

// AI Insights indexes
db.ai_insights.createIndex({ "type": 1, "createdAt": -1 });
db.ai_insights.createIndex({ "dealerId": 1, "type": 1, "createdAt": -1 });
db.ai_insights.createIndex({ "customerId": 1, "type": 1, "createdAt": -1 });
db.ai_insights.createIndex({ "validUntil": 1 });
db.ai_insights.createIndex({ "confidence": -1, "type": 1 });

print("MongoDB initialization completed successfully!");
print("Created collections: customer_analytics, sales_analytics, customer_feedback, ai_insights");
print("Created indexes for optimal query performance");
print("Database user 'evdms_user' created with readWrite permissions");