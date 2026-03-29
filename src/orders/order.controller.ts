import { Controller, Post, Body } from '@nestjs/common';
import {
  //ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

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

  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // @ApiOperation({ summary: 'Get trucks' })
  // @ApiOkResponse({
  //   description: 'Return all trucks',
  //   type: TruckResponseDto,
  //   isArray: true,
  // })
  // async findAll() {
  //   const trucks = await this.trucksService.findAll();
  //   return trucks;
  // }

  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // @ApiOperation({ summary: 'Get a truck by id' })
  // @ApiParam({ name: 'id', description: 'The truck id' })
  // @ApiOkResponse({
  //   description: 'Returns the truck with the specified id',
  //   type: TruckResponseDto,
  // })
  // async findById(@Param('id', ParseObjectIdPipe) id: string) {
  //   const truck = await this.trucksService.findById(id);
  //   return truck;
  // }

  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a user' })
  // @ApiBody({ type: UpdateTruckDto })
  // @ApiCreatedResponse({
  //   description: 'The truck has been succesfully updated',
  //   type: TruckResponseDto,
  // })
  // async update(
  //   @Param('id', ParseObjectIdPipe) id: string,
  //   @Body() updateTruckDto: UpdateTruckDto,
  // ) {
  //   const updatedTruck = await this.trucksService.update(id, updateTruckDto);

  //   return updatedTruck;
  // }

  // @ApiBearerAuth('jwt')
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a truck' })
  // delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
  //   return this.trucksService.delete(id);
  // }
}
