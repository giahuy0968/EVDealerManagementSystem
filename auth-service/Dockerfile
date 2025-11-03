# ==================================
# STAGE 1: Build stage với Maven
# ==================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml và download dependencies trước (tận dụng Docker cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code và build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==================================
# STAGE 2: Runtime stage với JRE
# ==================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Tạo user non-root để chạy ứng dụng (bảo mật)
RUN groupadd -r authservice && useradd -r -g authservice authservice

# Copy JAR file từ build stage
COPY --from=build /app/target/*.jar app.jar

# Đổi quyền sở hữu
RUN chown -R authservice:authservice /app

# Chuyển sang user non-root
USER authservice

# Expose port
EXPOSE 3001

# Health check (Spring Actuator)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/actuator/health || exit 1

# JVM options để tối ưu container
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Start application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]