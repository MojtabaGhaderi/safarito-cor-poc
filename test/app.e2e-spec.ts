import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as crypto from 'crypto';

describe('Multi-Tenancy RLS (e2e)', () => {
  let app: INestApplication;

  // We generate fresh tenant IDs for every test suite run 
  // so the database state doesn't interfere with our assertions.
  const tenantA = crypto.randomUUID();
  const tenantB = crypto.randomUUID();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Middleware: should reject requests without a tenant ID', () => {
    return request(app.getHttpServer())
      .get('/orders')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Missing x-tenant-id header');
      });
  });

  it('2. Seed: should create an order for Tenant A', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .set('x-tenant-id', tenantA)
      .send({ productName: 'Tenant A Product', amount: 100 })
      .expect(201)
      .expect((res) => {
        expect(res.body.tenant_id).toEqual(tenantA);
        expect(res.body.product_name).toEqual('Tenant A Product');
      });
  });

  it('3. Seed: should create an order for Tenant B', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .set('x-tenant-id', tenantB)
      .send({ productName: 'Tenant B Product', amount: 200 })
      .expect(201)
      .expect((res) => {
        expect(res.body.tenant_id).toEqual(tenantB);
        expect(res.body.product_name).toEqual('Tenant B Product');
      });
  });

  it('4. Isolation: Tenant A should ONLY see Tenant A data', () => {
    return request(app.getHttpServer())
      .get('/orders')
      .set('x-tenant-id', tenantA)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        // Because we generated unique UUIDs for this run, Tenant A should have exactly 1 order
        expect(res.body.length).toBe(1);

        const order = res.body[0];
        expect(order.tenant_id).toEqual(tenantA);
        expect(order.product_name).toEqual('Tenant A Product');

        // Double-check: ensure Tenant B's UUID doesn't exist anywhere in the payload
        const foundTenantB = res.body.some(o => o.tenant_id === tenantB);
        expect(foundTenantB).toBe(false);
      });
  });
});