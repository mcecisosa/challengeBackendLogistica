import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTruckDto {
  @ApiProperty({
    description: 'The unique ID of the user',
    example: '60d5ecb898978c21d8g61t2',
  })
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'The year of the truck',
    example: '2025',
  })
  @IsString()
  @Length(4, 4, { message: 'The year must be 4 characters' })
  year: string;

  @ApiProperty({
    description: 'The color of the truck',
    example: 'yellow',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'The plates of the truck',
    example: 'AD123BC',
  })
  @IsString()
  @IsNotEmpty()
  plates: string;
}
