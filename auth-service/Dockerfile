# ==================================
# STAGE 1: Build stage với Maven
# ==================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml và tải dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code và build JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==================================
# STAGE 2: Runtime stage (chạy app)
# ==================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN groupadd -r authservice && useradd -r -g authservice authservice

COPY --from=build /app/target/*.jar app.jar

RUN chown -R authservice:authservice /app
USER authservice

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/actuator/health || exit 1

ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
