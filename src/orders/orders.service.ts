import { Injectable } from '@nestjs/common';
import { TenantDatabaseService } from '../database/tenant-database.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(private readonly tenantDb: TenantDatabaseService) { }

    async create(productName: string, amount: number): Promise<Order> {
        return this.tenantDb.execute(async (manager) => {
            const order = manager.create(Order, { product_name: productName, amount });
            return manager.save(order);
        });
    }

    async findAll(): Promise<Order[]> {
        return this.tenantDb.execute(async (manager) => {
            // جداسازی داده‌ها (Tenant Isolation) کاملاً در لایه دیتابیس هندل می‌شود
            return manager.find(Order);
        });
    }
}