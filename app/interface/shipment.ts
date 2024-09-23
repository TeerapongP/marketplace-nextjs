import Order from "./order";
export default interface Shipment {
  shipmentId: number;
  shipmentDate: string;
  name: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  order: Order;
}
