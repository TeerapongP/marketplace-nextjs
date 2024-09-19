export interface CartItem {
  productId: number; // Change from string to number
  productName: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  images: string;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } };
