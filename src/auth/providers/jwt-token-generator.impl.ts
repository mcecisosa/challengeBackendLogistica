import { Injectable } from '@nestjs/common';
import { TokenGenerator } from '../interfaces/token-generator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenGeneratorImpl implements TokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }
}
