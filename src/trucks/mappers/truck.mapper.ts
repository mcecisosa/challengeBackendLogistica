import { Truck } from '../entities/truck.entity';
import { TruckDbRaw } from 'src/orders/types/order-db-raw';
import { UserMapper } from 'src/users/mapper/user.mapper';

export class TruckMapper {
  static toEntity(raw: TruckDbRaw) {
    const userEntity = UserMapper.toEntity(raw.user);

    return new Truck(
      raw.id || String(raw._id),
      raw.year,
      raw.color,
      raw.plates,
      userEntity,
    );
  }
}
