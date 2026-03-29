export class Location {
  constructor(
    public readonly id: string,
    public address: string,
    public place_id: string,
    public latitude: number,
    public longitude: number,
  ) {}
}
