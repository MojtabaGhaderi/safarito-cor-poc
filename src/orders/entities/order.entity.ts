import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_name: string;

    @Column('decimal')
    amount: number;

    // مقداردهی این فیلد مستقیماً توسط پایگاه داده (از طریق کانتکست RLS) انجام می‌شود
    // نیازی به ارسال آن از لایه اپلیکیشن نیست
    @Column({ default: () => "current_setting('rls.tenant_id')::uuid" })
    tenant_id: string;
}