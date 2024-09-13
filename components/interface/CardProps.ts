export default interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  status?: boolean;
  shopId?: number;
  roleId?: number;
  disabled?: boolean;
  onToggleChange?: (shopId: number, checked: boolean) => void;
  onButtonClick?: (shopId: number) => void; // Add this line
}
