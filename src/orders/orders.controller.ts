import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() body: { productName: string; amount: number }) {
        return this.ordersService.create(body.productName, body.amount);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }
}