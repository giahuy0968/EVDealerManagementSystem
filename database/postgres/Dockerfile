FROM postgres:15-alpine

# Set environment variables
ARG POSTGRES_PASSWORD
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres.grgbbhzjlddgocgyhekd

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY seed.sql /docker-entrypoint-initdb.d/02-seed.sql

# Set permissions
RUN chmod 644 /docker-entrypoint-initdb.d/*.sql

# Expose PostgreSQL port
EXPOSE 6543

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB