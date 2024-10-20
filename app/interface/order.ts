import OrderItem from "./orderItem";
export default interface Order {
  orderId: number;
  orderDate: string;
  totalPrice: number;
  orderItems: OrderItem[];
}
