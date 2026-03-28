import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from 'src/users/user.repository';
import { PasswordHasher } from 'src/shared/security/password-hasher';
import { InvalidCredentialError } from 'src/shared/errors/errors';
import { TokenGenerator } from 'src/auth/interfaces/token-generator';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) throw new InvalidCredentialError();

    const isMatchingPass = await this.passwordHasher.compare(
      password,
      user.password,
    );

    if (!isMatchingPass) throw new InvalidCredentialError();

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.tokenGenerator.sign(payload);

    return { accessToken, user: { id: user?.id, email: user.email } };
  }
}
