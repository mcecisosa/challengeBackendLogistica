import { Location } from 'src/locations/entities/location.entity';
import { Truck } from 'src/trucks/entities/truck.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from '../types/order-status.enum';

export class Order {
  constructor(
    public readonly id: string,
    public status: OrderStatus,
    public user: User,
    public truck: Truck,
    public pickup: Location,
    public dropoff: Location,
  ) {}
}
