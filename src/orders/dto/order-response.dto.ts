import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { TruckResponseDto } from 'src/trucks/dto/truck-response.dto';
import { LocationResponseDto } from 'src/locations/dto/location-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: 1,
  })
  id: string;

  @ApiProperty({
    description: 'The state of the order',
    example: 'created',
  })
  status: string;

  @ApiProperty({ type: UserResponseDto, description: 'The owner of the truck' })
  user: UserResponseDto;

  @ApiProperty({ type: TruckResponseDto, description: 'The truck' })
  truck: TruckResponseDto;

  @ApiProperty({
    type: LocationResponseDto,
    description: 'The pickup location',
  })
  pickup: LocationResponseDto;

  @ApiProperty({
    type: LocationResponseDto,
    description: 'The dropoff location',
  })
  dropoff: LocationResponseDto;

  static fromEntity(order: Order): OrderResponseDto {
    return {
      id: order.id,
      status: order.status,
      user: UserResponseDto.fromEntity(order.user),
      truck: TruckResponseDto.fromEntity(order.truck),
      pickup: LocationResponseDto.fromEntity(order.pickup),
      dropoff: LocationResponseDto.fromEntity(order.dropoff),
    };
  }
}
