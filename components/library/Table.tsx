import React from 'react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  variant?: 'default' | 'striped' | 'bordered';
  hoverable?: boolean;
  compact?: boolean;
}

/**
 * Table Component
 * 
 * A data table with configurable columns and styling options.
 * Supports striped rows, borders, and hover effects.
 * 
 * Usage:
 * <Table 
 *   columns={[{key: 'name', label: 'Name'}, {key: 'age', label: 'Age'}]}
 *   data={[{name: 'John', age: 30}]}
 *   variant="striped"
 * />
 */
export const Table: React.FC<TableProps> = ({
  columns,
  data,
  variant = 'default',
  hoverable = true,
  compact = false,
}) => {
  const baseClasses = 'w-full text-left border-collapse';
  const thBaseClasses = `font-semibold text-gray-900 bg-gray-50 ${compact ? 'px-3 py-2 text-sm' : 'px-6 py-3'}`;
  const tdBaseClasses = `text-gray-700 ${compact ? 'px-3 py-2 text-sm' : 'px-6 py-4'}`;
  
  const variantClasses = {
    default: '',
    striped: '',
    bordered: 'border border-gray-300',
  };
  
  const hoverClass = hoverable ? 'hover:bg-gray-50' : '';
  
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={`${baseClasses} ${variantClasses[variant]}`}>
        <thead>
          <tr className="border-b-2 border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={thBaseClasses}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  border-b border-gray-100 last:border-0
                  ${variant === 'striped' && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                  ${hoverClass}
                `}
              >
                {columns.map((column) => (
                  <td key={column.key} className={tdBaseClasses}>
                    {row[column.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
