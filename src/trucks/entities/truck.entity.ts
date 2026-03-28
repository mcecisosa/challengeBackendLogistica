import { User } from 'src/users/entities/user.entity';

export class Truck {
  constructor(
    public readonly id: string,
    public year: string,
    public color: string,
    public plates: string,
    public user: User,
  ) {}
}
