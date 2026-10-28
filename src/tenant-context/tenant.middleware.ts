import { Injectable, NestMiddleware, Inject, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { TenantContext, TENANT_CONTEXT } from './tenant-context.provider';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(
        @Inject(TENANT_CONTEXT)
        private readonly als: AsyncLocalStorage<TenantContext>,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        // در محیط پروداکشن، این شناسه از Payload توکن JWT استخراج می‌شود
        const tenantId = req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            throw new BadRequestException('Missing x-tenant-id header');
        }

        const store: TenantContext = { tenantId };

        // کپسوله‌سازی کل چرخه حیات ریکوئست در کانتکست اختصاصی
        this.als.run(store, () => {
            next();
        });
    }
}