import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../types/order-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusOrderDto {
  @ApiProperty({
    description: 'The status of the order',
    enum: OrderStatus,
    example: OrderStatus.IN_TRANSIT,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: `Status must be one of ${Object.values(OrderStatus).join(', ')}`,
  })
  status: OrderStatus;
}
