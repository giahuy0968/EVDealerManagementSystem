# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# Create non-root user for security
RUN groupadd -r dealerservice && useradd -r -g dealerservice dealerservice

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar
RUN chown -R dealerservice:dealerservice /app

USER dealerservice

# Expose port
EXPOSE 3002

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]