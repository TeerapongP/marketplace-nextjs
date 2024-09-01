// interface/SearchInputProps.ts
export default interface SearchInputProps {
    onSearch: (value: string) => void;
    onClick: (value: string) => void; // Ensure onClick accepts a string argument
}
