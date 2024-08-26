export default interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  width?: string;
  textColor?: string;
  color?: string;
  onClick?: () => void; // Add onClick prop
}