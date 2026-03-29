import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../entities/location.entity';

export class LocationResponseDto {
  @ApiProperty({
    description: 'The ID of a location',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'The address of the location',
    example: 'Las Heras 150',
  })
  address: string;

  @ApiProperty({
    description: 'The place_id of the location',
    example: 'yellow',
  })
  place_id: string;

  @ApiProperty({
    description: 'The latitude of the location',
    example: '1221',
  })
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the location',
    example: '1221',
  })
  longitude: number;

  static fromEntity(location: Location): LocationResponseDto {
    return {
      id: location.id,
      address: location.address,
      place_id: location.place_id,
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }
}
