FROM mongo:7.0

# Copy initialization script
COPY init.js /docker-entrypoint-initdb.d/

# Set permissions
RUN chmod +x /docker-entrypoint-initdb.d/init.js

# Set environment variables
ENV MONGO_INITDB_ROOT_USERNAME=evdms_user
ENV MONGO_INITDB_ROOT_PASSWORD=evdms_password
ENV MONGO_INITDB_DATABASE=evdms

# Expose MongoDB port
EXPOSE 27017

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=40s --retries=3 \
  CMD echo 'db.stats().ok' | mongo localhost:27017/evdms --quiet