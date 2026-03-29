import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import {
  //ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'The order has been succesfully created',
    type: OrderResponseDto,
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const newOrder = await this.orderService.create(createOrderDto);
    console.log('NEW ORDER DEL CONTROLLER:', newOrder);

    return OrderResponseDto.fromEntity(newOrder);
  }

  @Get()
  @ApiOperation({ summary: 'Get trucks' })
  @ApiOkResponse({
    description: 'Return all trucks',
    type: OrderResponseDto,
    isArray: true,
  })
  async findAll() {
    const orders = await this.orderService.findAll();

    return orders.map((order) => OrderResponseDto.fromEntity(order));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a order by id' })
  @ApiParam({ name: 'id', description: 'The order id' })
  @ApiOkResponse({
    description: 'Returns the order with the specified id',
    type: OrderResponseDto,
  })
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const order = await this.orderService.findById(id);
    return OrderResponseDto.fromEntity(order);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a order' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiCreatedResponse({
    description: 'The order has been succesfully updated',
    type: OrderResponseDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updatedOrder = await this.orderService.update(id, updateOrderDto);

    return OrderResponseDto.fromEntity(updatedOrder);
  }

  @ApiNoContentResponse({ description: 'Order deleted successfully' })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a order' })
  delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.orderService.delete(id);
  }
}
