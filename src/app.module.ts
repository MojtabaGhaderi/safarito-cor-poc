import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TenantContextModule } from './tenant-context/tenant-context.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'safarito-core-poc',
    }),
    // ۱. اتصال استاندارد TypeORM که به کانتینر داکر اشاره می‌کند
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'app_user',
      password: 'app_password',
      database: 'tenant_poc',
      entities: [Order],
      synchronize: false,
    }),
    // ۲. ثبت معماری چند مستاجری (Multi-Tenancy)
    TenantContextModule,
    DatabaseModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }