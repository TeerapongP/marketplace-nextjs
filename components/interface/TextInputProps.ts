export default interface TextInputProps {
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
  name?: string; // Optional: The name attribute for the input element.
  disabled?: boolean; // Optional: Indicates if the input is disabled.
  maxLength?: number; // Optional: Maximum length of the input.
}
