import Product from "../../app/interface/products";
export default interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  status?: boolean;
  shopId?: number;
  roleId?: number;
  bgColor?: string;
  disabled?: boolean;
  price?: number;
  bgButtonColor?: string;
  onToggleChange?: (shopId: number, checked: boolean) => void;
  onButtonClick?: (product: Product) => void; // Updated to accept a Product parameter
}
