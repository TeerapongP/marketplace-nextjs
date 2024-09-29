export default interface DropdownProps {
  url: string;                // API endpoint to fetch data
  onSelect: (selected: any) => void; // Callback when an option is selected
  valueString?: string;        // Key names for value from the data (comma separated)
  keyString?: string;          // Key names for labels from the data (comma separated)
  placeholder: string;  
  disable?:boolean;
  value?: number | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

}