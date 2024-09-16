import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { GridCell } from '@/context/GridContext';

interface EmptyCellsTableProps {
  cells: GridCell[];
}

export function EmptyCellsTable({ cells }: EmptyCellsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Row</TableHead>
          <TableHead>Column</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cells.map((cell) => (
          <TableRow key={`${cell.row}-${cell.col}`}>
            <TableCell>{cell.row}</TableCell>
            <TableCell>{cell.col}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
