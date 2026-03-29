import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The unique ID of the user',
    example: '60d5ecb898978c21d8g61t2',
  })
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'The unique ID of the truck',
    example: '56h5ecb898978c21d8g61t2',
  })
  @IsMongoId()
  @IsNotEmpty()
  truck: string;

  @ApiProperty({
    description: 'The unique ID of the pickup location',
    example: '56h5ecb898978c21d8g61t2',
  })
  @IsMongoId()
  @IsNotEmpty()
  pickup: string;

  @ApiProperty({
    description: 'The unique ID of the dropoff location',
    example: '56h5ecb898978c21d8g61t2',
  })
  @IsMongoId()
  @IsNotEmpty()
  dropoff: string;
}
