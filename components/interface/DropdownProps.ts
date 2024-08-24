export default interface DropdownProps {
  url: string; // API endpoint to fetch options
  onSelect: (option: number) => void;
  placeholder?: string;
}