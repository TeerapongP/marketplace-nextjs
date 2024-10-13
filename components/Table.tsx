import Button from './Button';
import TableProps from './interface/TableProps';
import React from 'react';

const DataTable: React.FC<TableProps> = ({ data, column, onDelete }) => {
    const handleDelete = (item: any) => {
        onDelete(item);
    };

    return (
        <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg">
            <table className="tw-w-full tw-text-sm tw-text-center rtl:tw-text-right tw-text-gray-500 dark:tw-text-gray-400">
                <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-gray-700 dark:tw-text-gray-400">
                    <tr>
                        {column.map((col, index) => (
                            <th key={`header-${index}`} scope="col" className="tw-px-6 tw-py-3">
                                {col.header}
                            </th>
                        ))}
                        <th scope="col" className="tw-px-6 tw-py-3">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.reserveSpaceId} className="tw-bg-white tw-border-b tw-dark:bg-gray-800 tw-dark:border-gray-700 hover:tw-bg-gray-50 tw-dark:hover:bg-gray-600">
                            {column.map((col, colIndex) => {
                                let cellValue;
                                // Determine how to render the cell based on the type
                                switch (col.type) {
                                    case 'datetime':
                                        cellValue = new Date(item[col.field]).toLocaleString(); // Format datetime
                                        break;
                                    case 'checkbox':
                                        cellValue = item[col.field] ? '✔️' : '❌';
                                        break;
                                    default:
                                        // Check if the field corresponds to userName or spaceLocation
                                        if (col.field === 'userName') {
                                            cellValue = item.user?.userName; // Access nested userName
                                        } else if (col.field === 'spaceLocation') {
                                            cellValue = item.space?.spaceLocation; // Access nested spaceLocation
                                        } else {
                                            cellValue = item[col.field]; // Default rendering
                                        }
                                }
                                return (
                                    <td key={`cell-${item.reserveSpaceId}-${colIndex}`} className="tw-px-6 tw-py-4">
                                        {cellValue}
                                    </td>
                                );
                            })}
                            <td className="tw-px-6 tw-py-4">
                                <Button
                                    type="button"
                                    text="Delete"
                                    className='tw-w-full tw-py-3 tw-bg-gradient-to-r tw-from-red-500 tw-to-orange-600 tw-text-white tw-rounded-lg tw-shadow-lg tw-transform tw-hover:scale-105 tw-transition-all tw-duration-300'
                                    onClick={() => handleDelete(item)} // Pass the item to the delete handler
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
