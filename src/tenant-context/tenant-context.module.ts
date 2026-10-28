import { Module, MiddlewareConsumer, NestModule, Global } from '@nestjs/common';
import { tenantContextProvider } from './tenant-context.provider';
import { TenantMiddleware } from './tenant.middleware';

@Global()
@Module({
    providers: [tenantContextProvider],
    exports: [tenantContextProvider], // خروجی داده شده تا سایر ماژول‌ها بتوانند نمونه ALS را تزریق (inject) کنند
})
export class TenantContextModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // اعمال میدل‌ویر (middleware) به صورت سراسری روی تمامی مسیرها
        consumer.apply(TenantMiddleware).forRoutes('*');
    }
}