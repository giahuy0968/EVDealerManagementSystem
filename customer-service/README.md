# Customer Service

Customer management microservice for EV Dealer Management System.

## Features

- ✅ Customer CRUD with soft delete
- ✅ Lead management & conversion with auto round-robin assignment
- ✅ Test drive scheduling with reminders
- ✅ Feedback & complaints handling
- ✅ Customer segmentation (AI optional)
- ✅ Role-based access control (ADMIN, DEALER_MANAGER, DEALER_STAFF)
- ✅ Multi-field search (name, phone, email)
- ✅ Staff-only-assigned filtering for DEALER_STAFF role

## Tech Stack

- Java 21 + Spring Boot 3.5.6
- Spring Data JPA (PostgreSQL)
- Spring Security + JWT with custom claims extraction
- RabbitMQ for events
- Spring Boot Actuator for health checks
- Lombok

## API Endpoints

### Customer Management
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers` - List customers (dealer/admin filter, pagination)
- `GET /api/v1/customers/{id}` - Get customer
- `PUT /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Soft delete customer
- `GET /api/v1/customers/search` - Search by name/phone/email
- `GET /api/v1/customers/{id}/history` - Interaction history
- `POST /api/v1/customers/{id}/notes` - Add note
- `GET /api/v1/customers/{id}/orders` - Orders (stub)

### Lead Management
- `POST /api/v1/leads` - Create lead (public, from website)
- `GET /api/v1/leads` - List leads
- `GET /api/v1/leads/{id}` - Get lead
- `PUT /api/v1/leads/{id}` - Update lead
- `PUT /api/v1/leads/{id}/status` - Change status
- `POST /api/v1/leads/{id}/convert` - Convert to customer
- `PUT /api/v1/leads/{id}/assign` - Assign to staff

### Test Drive Management
- `POST /api/v1/test-drives` - Schedule test drive
- `GET /api/v1/test-drives` - List (date range filter)
- `GET /api/v1/test-drives/{id}` - Get details
- `PUT /api/v1/test-drives/{id}` - Update
- `PUT /api/v1/test-drives/{id}/status` - Update status
- `POST /api/v1/test-drives/{id}/feedback` - Add feedback
- `GET /api/v1/test-drives/calendar` - Calendar view

### Feedback & Complaints
- `POST /api/v1/feedbacks` - Submit feedback
- `GET /api/v1/feedbacks` - List feedback
- `GET /api/v1/feedbacks/{id}` - Get feedback
- `PUT /api/v1/feedbacks/{id}/resolve` - Resolve feedback
- `POST /api/v1/complaints` - Submit complaint
- `GET /api/v1/complaints` - List complaints
- `PUT /api/v1/complaints/{id}/resolve` - Resolve complaint

### Segmentation (AI Optional)
- `GET /api/v1/customers/segments` - Customer segments
- `GET /api/v1/customers/{id}/score` - Purchase score

## Environment Variables

```bash
PORT=3003
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/evdms
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JPA_DDL_AUTO=update
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
JWT_SECRET=dev-secret-change-me
```

## Run Locally

```bash
# Build
./mvnw clean package -DskipTests

# Run
java -jar target/customer-service-0.0.1-SNAPSHOT.jar
```

## Docker

```bash
docker build -t customer-service .
docker run -p 3003:3003 -e SPRING_DATASOURCE_URL=... customer-service
```

## Events Published

- `customer.created` - When customer is created
- `test_drive.scheduled` - When test drive is scheduled
- `test_drive.reminder` - 1 day before test drive
- `feedback.received` - When feedback is submitted
- `complaint.created` - When complaint is created
- `lead.converted` - When lead converts to customer

## Scheduled Jobs

- Daily 09:00 UTC: Send test drive reminders for next day
- Daily 02:00 UTC: Auto-mark stale leads as LOST (30 days no contact)

## Business Rules

- ✅ **Dealer Staff**: see only assigned customers (auto-filtered by assignedStaffId)
- ✅ **Dealer Manager**: see all customers for their dealer (filtered by dealerId from JWT)
- ✅ **Admin**: see all customers system-wide (no dealer filter)
- ✅ **Phone unique per dealer** (database constraint)
- ✅ **CCCD must be 12 digits** (validation)
- ✅ **Phone format**: `0[1-9][0-9]{8}` (Vietnam mobile validation)
- ✅ **Auto-assign leads** via round-robin to dealer staff
- ✅ **Auto-mark stale leads** as LOST after 30 days no contact

## JWT Claims Used

The service extracts the following from JWT tokens issued by auth-service:

```json
{
  "sub": "user@example.com",
  "user_id": "uuid",
  "dealer_id": "uuid",
  "role": "DEALER_MANAGER",
  "roles": ["DEALER_MANAGER"]
}
```

## Testing

```bash
# Unit tests
./mvnw test

# Build with tests
./mvnw clean package

# Health check
curl http://localhost:3003/api/v1/health
curl http://localhost:3003/actuator/health
```
