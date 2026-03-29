import { UserDbRaw } from 'src/orders/types/order-db-raw';
import { User } from 'src/users/entities/user.entity';

export class UserMapper {
  static toEntity(raw: UserDbRaw) {
    return new User(raw.id || String(raw._id), raw.email, raw.password);
  }
}
