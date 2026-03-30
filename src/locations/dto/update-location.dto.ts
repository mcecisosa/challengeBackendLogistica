import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({
    description: 'The place_id of the location',
    example: 'ChIJiRp93iEC0oURvJVqErpVVHw',
  })
  @IsString()
  @IsNotEmpty()
  place_id: string;
}
