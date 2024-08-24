export default interface ButtonProps {
    text: string;
    textColor:string
    color: string; // The color can be a Tailwind class or a specific hex/rgb color
    type?: 'button' | 'submit' | 'reset'; // Type prop with a specific set of options
    width:string
  }