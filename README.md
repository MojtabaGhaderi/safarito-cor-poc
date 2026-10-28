# Core Architecture PoC: Multi-Tenancy with RLS & ALS

## Overview
This repository serves as a Proof of Concept (PoC) for a highly scalable, leak-proof multi-tenancy architecture. 

By offloading data isolation to the database engine (PostgreSQL Row-Level Security) rather than relying on application-level query filters (`.where({ tenant_id })`), we structurally eliminate the risk of cross-tenant data leaks.

## Architecture Highlights
* **Context Propagation:** Node.js `AsyncLocalStorage` (ALS) is utilized to bind the `tenant_id` to the request lifecycle, avoiding manual prop-drilling across services.
* **Transaction Scoping:** The custom `TenantDatabaseService` injects the ALS context directly into the PostgreSQL transaction using `set_config('rls.tenant_id', $1, true)`. The `true` flag strictly localizes the setting to the current transaction, preventing context leakage within the connection pool.
* **Database Enforcement:** PostgreSQL RLS policies transparently evaluate the `tenant_id` context. Application queries remain agnostic to tenancy boundaries.

## Infrastructure Setup
```bash
docker-compose up -d
npm install
npm run start:dev