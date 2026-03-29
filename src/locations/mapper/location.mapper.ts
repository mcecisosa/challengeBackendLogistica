import { LocationDbRaw } from 'src/orders/types/order-db-raw';
import { Location } from '../entities/location.entity';

export class LocationMapper {
  static toEntity(raw: LocationDbRaw) {
    return new Location(
      raw.id || String(raw._id),
      raw.address,
      raw.place_id,
      raw.latitude,
      raw.longitude,
    );
  }
}
