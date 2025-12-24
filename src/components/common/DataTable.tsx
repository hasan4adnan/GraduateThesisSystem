import { type ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import Button from '../ui/Button';
import { Edit, Trash2 } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchValue?: string;
  searchFields?: (keyof T)[];
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  searchValue = '',
  searchFields = [],
}: DataTableProps<T>) {
  const filteredData = searchValue
    ? data.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchValue.toLowerCase());
        })
      )
    : data;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.header}</TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead className="w-24">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell 
                className="text-center py-8 text-gray-500" 
                {...({ colSpan: columns.length + (onEdit || onDelete ? 1 : 0) } as any)}
              >
                No data found
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] || '')}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

