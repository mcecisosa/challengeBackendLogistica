import { CreateOrderData } from './create-order-data.type';

export type UpdateOrderData = Partial<CreateOrderData>;

export type UpdateStatusOrderData = {
  status: string;
};
