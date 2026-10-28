import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { TenantContext, TENANT_CONTEXT } from '../tenant-context/tenant-context.provider';

@Injectable()
export class TenantDatabaseService {
    constructor(
        private readonly dataSource: DataSource,
        @Inject(TENANT_CONTEXT)
        private readonly als: AsyncLocalStorage<TenantContext>,
    ) { }

    async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
        const store = this.als.getStore();
        const tenantId = store?.tenantId;

        if (!tenantId) {
            throw new InternalServerErrorException('ALS Context missing: Tenant ID is required');
        }

        return this.dataSource.transaction(async (manager: EntityManager) => {
            // تزریق شناسه به نشست فعلی پایگاه داده
            // فلگ true تضمین می‌کند که این تنظیمات فقط برای همین تراکنش معتبر است و به Connection Pool نشت نمی‌کند
            await manager.query(`SELECT set_config('rls.tenant_id', $1, true)`, [tenantId]);

            return work(manager);
        });
    }
}