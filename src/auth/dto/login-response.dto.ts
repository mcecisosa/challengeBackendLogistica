import { ApiProperty } from '@nestjs/swagger';

class LoginUserResponse {
  @ApiProperty({ example: '69c69954d2a98e694b4e1019' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: LoginUserResponse })
  user: LoginUserResponse;
}
