import Product from "./product";
export default interface OrderItem {
  orderItemId: number;
  quantity: number;
  product: Product;
}
