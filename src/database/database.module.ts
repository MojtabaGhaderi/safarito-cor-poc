import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantDatabaseService } from './tenant-database.service';

@Global()
@Module({
    imports: [
        // تنظیمات استاندارد TypeORM باید اینجا بارگذاری شود (به عنوان مثال از طریق forRootAsync)
        // فرض بر این است که TypeOrmModule در سطح اصلی برنامه (App) پیکربندی شده است
    ],
    providers: [TenantDatabaseService],
    exports: [TenantDatabaseService],
})
export class DatabaseModule { }