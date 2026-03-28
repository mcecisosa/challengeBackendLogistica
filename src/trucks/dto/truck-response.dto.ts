import { ApiProperty } from '@nestjs/swagger';
import { Truck } from '../entities/truck.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class TruckResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the truck',
    example: 1,
  })
  id: string;

  @ApiProperty({
    description: 'The year of the truck',
    example: '205',
  })
  year: string;

  @ApiProperty({
    description: 'The color of the truck',
    example: 'yellow',
  })
  color: string;

  @ApiProperty({
    description: 'The plates of the truck',
    example: 'AD145FF',
  })
  plates: string;

  @ApiProperty({ type: UserResponseDto, description: 'The owner of the truck' })
  user: UserResponseDto;

  static fromEntity(truck: Truck): TruckResponseDto {
    return {
      id: truck.id,
      year: truck.year,
      color: truck.color,
      plates: truck.plates,
      user: UserResponseDto.fromEntity(truck.user),
    };
  }
}
