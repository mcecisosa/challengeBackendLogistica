import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user', example: 1 })
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'juan@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The creation date of the user',
    example: '2026-03-28T00:28:45.450Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'The last update of the user',
    example: '2026-03-28T00:28:45.450Z',
  })
  updatedAt?: Date;

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
