CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create a dedicated non-superuser for the application
CREATE USER app_user WITH PASSWORD 'app_password';

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tenant_id UUID NOT NULL DEFAULT (NULLIF(current_setting('rls.tenant_id', true), '')::uuid)
);

-- 2. Grant permissions to the application user so it can query the table
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO app_user;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON orders
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('rls.tenant_id', true), '')::uuid)
    WITH CHECK (tenant_id = NULLIF(current_setting('rls.tenant_id', true), '')::uuid);