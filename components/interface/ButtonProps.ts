export default interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  width?: string;
  height?: string;
  textColor?: string;
  color?: string;
  onClick?: () => void; // Add onClick prop
  disabled?: boolean; // Add this line
}