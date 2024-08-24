export default interface TextInputProps {
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
    type?: string;
    placeholder?: string;
  }