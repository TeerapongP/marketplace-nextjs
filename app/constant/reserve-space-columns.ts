export interface IColumnConfig {
    field: string;
    header: string;
    type?: 'text' | 'number' | 'date' | 'checkbox' | 'dropdown' | 'datetime';
    dateFormat?: string; // Optional, used only for 'date' type
}

// Define the columns for the reserve space data
export const ReserveSpaceColumns: IColumnConfig[] = [
    { field: 'reserveSpaceId', header: 'Reserve Space ID', type: 'number', },
    { field: 'reserveDate', header: 'Reserve Date', type: 'datetime', dateFormat: 'YYYY-MM-DD', },
    { field: 'status', header: 'Status', type: 'checkbox', },
    { field: 'roleId', header: 'Role ID', type: 'number', },
    { field: 'spaceLocation', header: 'Space Location', type: 'text', },
    { field: 'userName', header: 'User Name', type: 'number', },
];
