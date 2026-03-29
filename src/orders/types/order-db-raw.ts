export interface UserDbRaw {
  _id: any;
  id?: string;
  email: string;
  password: string;
}

export interface LocationDbRaw {
  _id: any;
  id?: string;
  address: string;
  place_id: string;
  latitude: number;
  longitude: number;
}

export interface TruckDbRaw {
  _id: any;
  id?: string;
  year: string;
  color: string;
  plates: string;
  user: UserDbRaw;
}

export interface OrderDbRaw {
  _id: any;
  id: string;
  status: string;
  user: UserDbRaw;
  truck: TruckDbRaw;
  pickup: LocationDbRaw;
  dropoff: LocationDbRaw;
}
