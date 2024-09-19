interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text?: string;
  width?: string;
  height?: string;
  textColor?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}
