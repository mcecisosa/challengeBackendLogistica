import { Order } from '../entities/order.entity';
import { OrderDbRaw } from '../types/order-db-raw';
import { UserMapper } from 'src/users/mapper/user.mapper';
import { TruckMapper } from 'src/trucks/mappers/truck.mapper';
import { LocationMapper } from 'src/locations/mapper/location.mapper';

export class OrderMapper {
  static toEntity(raw: OrderDbRaw) {
    const userEntity = UserMapper.toEntity(raw.user);

    const truckEntity = TruckMapper.toEntity(raw.truck);

    const pickupEntity = LocationMapper.toEntity(raw.pickup);

    const dropoffEntity = LocationMapper.toEntity(raw.dropoff);

    return new Order(
      String(raw.id || raw._id),
      raw.status,
      userEntity,
      truckEntity,
      pickupEntity,
      dropoffEntity,
    );
  }
}
