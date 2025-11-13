# Customer Service - Optimization Summary

## Các Cải Tiến Chính (Main Optimizations)

### 1. JWT Claims Extraction & Role-Based Filtering ✅
**Trước đây:** Service chỉ verify JWT token nhưng không extract thông tin user
**Bây giờ:** 
- Tạo custom `JwtAuthentication` class để lưu trữ user_id, dealer_id, role từ JWT
- Tạo `AuthUtil` helper class để dễ dàng lấy thông tin user hiện tại
- Tự động filter dữ liệu theo role:
  - **DEALER_STAFF**: chỉ thấy customers được assign cho mình
  - **DEALER_MANAGER**: thấy tất cả customers của dealer
  - **ADMIN**: thấy tất cả customers trong hệ thống

### 2. Enhanced Search Capabilities ✅
**Trước đây:** Chỉ search theo name
**Bây giờ:**
- Search đa trường: name, phone, email cùng lúc
- Thêm method `searchMulti()` với custom JPQL query
- Support case-insensitive và LIKE pattern matching

```java
@Query("SELECT c FROM Customer c WHERE c.deleted = false AND " +
       "(LOWER(c.fullName) LIKE :pattern OR LOWER(c.phone) LIKE :pattern OR LOWER(c.email) LIKE :pattern)")
Page<Customer> findBySearchAndDeletedFalse(@Param("pattern") String pattern, Pageable pageable);
```

### 3. Round-Robin Lead Assignment ✅
**Trước đây:** TODO comment, không có implementation
**Bây giờ:**
- Tạo `RoundRobinService` để quản lý việc assign leads
- Auto-assign lead cho staff theo vòng tròn khi lead mới được tạo
- Thread-safe với `ConcurrentHashMap` và `AtomicInteger`

### 4. Global Exception Handling ✅
**Trước đây:** Không có centralized error handling
**Bây giờ:**
- Tạo `GlobalExceptionHandler` với `@RestControllerAdvice`
- Handle các exception phổ biến:
  - `EntityNotFoundException` → 404
  - `IllegalArgumentException` → 400
  - `AccessDeniedException` → 403
  - `MethodArgumentNotValidException` → 400 với field errors
  - Generic `Exception` → 500
- Trả về consistent `ErrorResponse` format

### 5. Spring Boot Actuator ✅
**Trước đây:** Không có health check endpoints
**Bây giờ:**
- Thêm `spring-boot-starter-actuator` dependency
- Configure `/actuator/health` endpoint
- Thêm custom `/api/v1/health` endpoint cho simple health check

### 6. Enhanced Repository Methods ✅
Thêm các query methods mới:
- `findByAssignedStaffIdAndDeletedFalse()` - for staff filtering
- `findByStatusAndDeletedFalse()` - for admin status filtering
- `findBy...AndSearchAndDeletedFalse()` - for multi-field search
- Support filtering by staff, dealer, and system-wide

## Cấu Trúc Code Mới (New Code Structure)

```
customer-service/
├── config/
│   └── SecurityConfig.java (updated with health endpoints)
├── controller/
│   ├── CustomerController.java (optimized with JWT claims)
│   ├── LeadController.java
│   ├── TestDriveController.java
│   ├── FeedbackController.java
│   ├── ComplaintController.java
│   ├── SegmentController.java
│   └── HealthController.java (NEW)
├── domain/
│   ├── entity/ (all with proper validation)
│   └── enums/ (all status enums)
├── dto/
│   └── ErrorResponse.java (NEW)
├── exception/
│   └── GlobalExceptionHandler.java (NEW)
├── messaging/
│   └── EventPublisher.java
├── repository/
│   └── CustomerRepository.java (enhanced with search queries)
├── security/
│   ├── JwtAuthenticationFilter.java (updated)
│   └── JwtAuthentication.java (NEW - custom auth object)
├── service/
│   ├── CustomerService.java (optimized filtering)
│   ├── LeadService.java (with round-robin)
│   ├── RoundRobinService.java (NEW)
│   ├── TestDriveService.java
│   ├── FeedbackService.java
│   ├── ComplaintService.java
│   └── SchedulerService.java
└── util/
    ├── JwtUtil.java
    ├── AuthUtil.java (NEW - helper for JWT claims)
    └── SecurityUtil.java (deprecated, use AuthUtil)
```

## API Changes

### Customer List Endpoint
**Before:**
```http
GET /api/v1/customers?dealerId={uuid}&admin=true
```

**After (Auto-detect từ JWT):**
```http
GET /api/v1/customers?dealerId={uuid}  # Optional, chỉ dùng cho Admin
# Service tự động extract dealerId và userId từ JWT
# STAFF → chỉ thấy assigned customers
# MANAGER → thấy dealer customers
# ADMIN → thấy all (có thể filter by dealerId)
```

### Search Endpoint
**Before:** Chỉ search name
```http
GET /api/v1/customers/search?dealerId={uuid}&q=John
```

**After:** Search name, phone, email
```http
GET /api/v1/customers/search?q=0901234567
# Tìm theo phone, name hoặc email
```

## Business Logic Enhancements

### 1. Staff-Only-Assigned Filter
- DEALER_STAFF tự động chỉ thấy customers mà họ được assign
- Không cần truyền staffId trong request, lấy từ JWT

### 2. Auto-Assign Leads
- Leads mới tự động được assign cho staff theo round-robin
- Cân bằng workload giữa các staff

### 3. Scheduled Jobs
- **09:00 UTC hàng ngày**: Gửi reminder cho test drives ngày mai
- **02:00 UTC hàng ngày**: Tự động mark leads không contact 30 ngày là LOST

## Validation Rules

Tất cả entities đều có validation:
- `@NotBlank` - required fields
- `@Email` - email format
- `@Pattern(regexp = "0[1-9][0-9]{8}")` - VN phone format
- `@Pattern(regexp = "\\d{12}")` - CCCD 12 digits
- `@Min`, `@Max` - rating 1-5

## Security Enhancements

1. **JWT Claims**: Extract user_id, dealer_id, role
2. **Auto-filtering**: Không cần truyền context trong request
3. **Method Security**: `@PreAuthorize` trên mọi endpoint
4. **CORS**: Configured cho frontend ports
5. **Public endpoints**: `/api/v1/health`, `/api/v1/leads` (POST)

## Events Published

Service phát ra các events cho Notification & Report services:
- `customer.created`
- `test_drive.scheduled`
- `test_drive.reminder`
- `feedback.received`
- `complaint.created`
- `lead.converted`

## Testing

```bash
# Build và test
./mvnw clean package

# Chỉ test
./mvnw test

# Health check
curl http://localhost:3003/api/v1/health
curl http://localhost:3003/actuator/health
```

## Deployment

### Docker
```bash
docker build -t customer-service .
docker run -p 3003:3003 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/evdms \
  -e JWT_SECRET=your-secret \
  customer-service
```

### Docker Compose
Service đã được configure trong `docker-compose.yml` với:
- Port 3003
- PostgreSQL connection
- RabbitMQ connection
- JWT secret từ environment

## Performance Considerations

1. **Database Indexes**: 
   - `idx_customers_dealer` on `dealer_id`
   - `idx_customers_name` on `full_name`
   - `uq_customer_phone_per_dealer` unique constraint

2. **Pagination**: Tất cả list endpoints support pagination

3. **Lazy Loading**: JPA entities with appropriate fetch strategies

4. **Connection Pooling**: Spring Boot default HikariCP

## Future Enhancements

- [ ] Redis cache for frequently accessed customers
- [ ] ElasticSearch for advanced search
- [ ] ML model for customer scoring (AI optional)
- [ ] Export customer data to Excel/PDF
- [ ] Bulk import customers from CSV
- [ ] Customer analytics dashboard endpoints
