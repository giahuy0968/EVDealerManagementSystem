# EV Dealer Management System

Hệ thống quản lý đại lý xe điện được phát triển bằng Spring Boot với kiến trúc microservices.

## 🏗️ Kiến trúc hệ thống

Project bao gồm 7 microservices:

- **API Gateway** (Port 8080): Gateway chính cho tất cả requests
- **Auth Service** (Port 8081): Xác thực và phân quyền người dùng
- **Customer Service** (Port 8082): Quản lý khách hàng
- **Dealer Service** (Port 8083): Quản lý đại lý
- **Manufacturer Service** (Port 8084): Quản lý nhà sản xuất
- **Notification Service** (Port 8085): Gửi thông báo
- **Report Analytics Service** (Port 8086): Báo cáo và phân tích

## 🛠️ Công nghệ sử dụng

- **Backend**: Spring Boot 3.5.6 + Java 21
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven

## 🚀 Cách chạy project

### Yêu cầu hệ thống

- Docker Desktop hoặc Docker Engine
- Docker Compose
- RAM tối thiểu: 4GB
- Disk space: 2GB

### 1. Clone project

```bash
git clone <repository-url>
cd EVDealerManagementSystem
```

### 2. Cấu hình environment variables

Chỉnh sửa file `.env` theo nhu cầu của bạn:

```bash
# Database Configuration
POSTGRES_DB=evdealerdb
POSTGRES_USER=evuser
POSTGRES_PASSWORD=evpassword

# Email Configuration (cho notification service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Build và chạy tất cả services

```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở background
docker-compose up --build -d
```

### 4. Kiểm tra trạng thái services

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f api-gateway

# Kiểm tra trạng thái containers
docker-compose ps
```

### 5. Truy cập ứng dụng

- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:8081
- **Customer Service**: http://localhost:8082
- **Dealer Service**: http://localhost:8083
- **Manufacturer Service**: http://localhost:8084
- **Notification Service**: http://localhost:8085
- **Report Analytics Service**: http://localhost:8086
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 6. Health Check

Kiểm tra sức khỏe của các services:

```bash
# API Gateway
curl http://localhost:8080/actuator/health

# Auth Service
curl http://localhost:8081/actuator/health

# Tương tự cho các service khác...
```

## 🔧 Các lệnh Docker hữu ích

### Development Commands

```bash
# Rebuild một service cụ thể
docker-compose up --build api-gateway

# Restart một service
docker-compose restart api-gateway

# Xem logs real-time
docker-compose logs -f --tail=100 api-gateway

# Exec vào container
docker-compose exec api-gateway sh

# Exec vào PostgreSQL
docker-compose exec postgres psql -U evuser -d evdealerdb
```

### Debugging Commands

```bash
# Xem resource usage
docker stats

# Inspect container
docker-compose exec api-gateway env

# Xem network
docker network ls
docker network inspect ev-network
```

### Cleanup Commands

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (mất dữ liệu)
docker-compose down -v

# Dừng và xóa images
docker-compose down --rmi all

# Cleanup hoàn toàn
docker-compose down -v --rmi all --remove-orphans
docker system prune -a
```

## 🗃️ Database Management

### Kết nối database

```bash
# Kết nối vào PostgreSQL container
docker-compose exec postgres psql -U evuser -d evdealerdb

# Hoặc từ host machine
psql -h localhost -U evuser -d evdealerdb
```

### Backup và Restore

```bash
# Backup database
docker-compose exec postgres pg_dump -U evuser evdealerdb > backup.sql

# Restore database
docker-compose exec -T postgres psql -U evuser -d evdealerdb < backup.sql
```

## 🔍 Troubleshooting

### Common Issues

1. **Port đã được sử dụng**:
   ```bash
   # Tìm process đang sử dụng port
   netstat -an | findstr :8080
   # Kill process nếu cần
   ```

2. **Database connection failed**:
   - Kiểm tra PostgreSQL container đã chạy: `docker-compose ps postgres`
   - Xem logs: `docker-compose logs postgres`

3. **Service không start được**:
   - Kiểm tra logs: `docker-compose logs <service-name>`
   - Kiểm tra health check: `docker-compose ps`

4. **Build failed**:
   - Xóa cache: `docker-compose build --no-cache <service-name>`
   - Kiểm tra Dockerfile syntax

### Performance Tuning

```bash
# Tăng memory cho containers
# Thêm vào docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 1G
    reservations:
      memory: 512M
```

## 🧪 Testing

```bash
# Build without running tests
docker-compose build --build-arg SKIP_TESTS=true

# Run tests trong container
docker-compose exec api-gateway mvn test

# Run integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📊 Monitoring

### Logs

```bash
# Centralized logging
docker-compose logs -f --since=1h

# Filter logs by level
docker-compose logs -f | grep ERROR

# Export logs
docker-compose logs --no-color > app.log
```

### Metrics

Truy cập metrics tại:
- http://localhost:8080/actuator/prometheus
- http://localhost:8081/actuator/metrics

## 🔐 Security Notes

1. **Thay đổi default passwords** trong `.env`
2. **JWT Secret**: Sử dụng secret key mạnh hơn trong production
3. **Database**: Cấu hình SSL cho production
4. **Network**: Chỉ expose các port cần thiết

## 📝 API Documentation

Sau khi chạy services, truy cập Swagger UI tại:
- http://localhost:8080/swagger-ui.html (API Gateway)
- http://localhost:8081/swagger-ui.html (Auth Service)
- Tương tự cho các service khác...

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Lưu ý**: Đây là setup cho môi trường development. Cho production, cần cấu hình thêm về security, monitoring, và performance optimization.