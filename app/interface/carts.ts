// interface/carts.ts
export interface CartItem {
  productId: number; // Ensure productId is a number
  productName: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  images: string;
}

export interface CartState {
  cartItems: CartItem[];
}
