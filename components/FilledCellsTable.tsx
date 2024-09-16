import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { GridCell, useGridContext } from '@/context/GridContext';
import { Button } from './ui/button';

interface FilledCellsTableProps {
  cells: GridCell[];
}

export function FilledCellsTable({ cells }: FilledCellsTableProps) {
  const { handleDelete } = useGridContext();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-full">Name</TableHead>
          <TableHead>Row</TableHead>
          <TableHead>Column</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cells.map((cell) => (
          <TableRow key={`${cell.row}-${cell.col}`}>
            <TableCell>{cell.name}</TableCell>
            <TableCell>{cell.row}</TableCell>
            <TableCell>{cell.col}</TableCell>
            <TableCell>
              <Button
                variant={'destructive'}
                size={'sm'}
                onClick={() => handleDelete(cell.uuid as string)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
