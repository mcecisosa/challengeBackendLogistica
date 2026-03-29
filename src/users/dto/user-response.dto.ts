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

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
