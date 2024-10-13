export default interface TableProps {
    data: any[];
    column: any[];
    dateFormat?: string;
    onDelete: (item: any) => void;
}