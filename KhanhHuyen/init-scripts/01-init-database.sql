#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create schemas for different services
    CREATE SCHEMA IF NOT EXISTS auth_service;
    CREATE SCHEMA IF NOT EXISTS customer_service;
    CREATE SCHEMA IF NOT EXISTS dealer_service;
    CREATE SCHEMA IF NOT EXISTS manufacturer_service;
    CREATE SCHEMA IF NOT EXISTS notification_service;
    CREATE SCHEMA IF NOT EXISTS report_analytics_service;

    -- Grant permissions
    GRANT ALL PRIVILEGES ON SCHEMA auth_service TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA customer_service TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA dealer_service TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA manufacturer_service TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA notification_service TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA report_analytics_service TO $POSTGRES_USER;

    -- Create extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

    -- Create audit function (for tracking changes)
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS \$\$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    \$\$ language 'plpgsql';

    COMMIT;
EOSQL