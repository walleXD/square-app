'use client';

import { Tables } from '@/utils/generated/database.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase/client';
import { GridAPI } from '@/queries/grid.api';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

type UserGridData = Tables<'grids'> & {
  empty_cells_count?: number;
};
interface DataTableProps {
  data: UserGridData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [gridData, setGridData] = useState<UserGridData[]>(data);
  const supabase = useSupabaseBrowser();

  const fetchEmptyCellsCounts = async () => {
    const updatedGridData = await Promise.all(
      gridData.map(async (grid) => {
        const { count } = await GridAPI.countEmptyCells(supabase, grid.uuid!);
        return { ...grid, empty_cells_count: count };
      })
    );
    setGridData(updatedGridData as UserGridData[]);
  };

  useEffect(() => {
    fetchEmptyCellsCounts();
  });

  const handleDelete = async (id: string) => {
    const { error } = await GridAPI.deleteGrid(supabase, id);
    if (error) {
      console.error('Error deleting grid:', error.message);
    } else {
      setGridData((prevData) => prevData.filter((grid) => grid.uuid !== id));
      // Refresh empty cell counts after deletion
      fetchEmptyCellsCounts();
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Columns</TableHead>
          <TableHead>Rows</TableHead>
          <TableHead>Empty cells</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gridData.map((grid) => (
          <TableRow key={grid.id}>
            <TableCell>
              <Link
                href={`/protected/${grid.uuid}`}
                className="text-primary hover:underline"
              >
                {grid.name}
              </Link>
            </TableCell>
            <TableCell>{grid.num_cols}</TableCell>
            <TableCell>{grid.num_rows}</TableCell>
            <TableCell>{grid.empty_cells_count ?? 'Loading...'}</TableCell>
            <TableCell>
              {grid.created_at
                ? new Date(grid.created_at).toLocaleString()
                : 'N/A'}
            </TableCell>
            <TableCell>
              {grid.updated_at
                ? new Date(grid.updated_at).toLocaleString()
                : 'N/A'}
            </TableCell>
            <TableCell>
              <Button
                variant={'destructive'}
                onClick={() => handleDelete(grid.uuid!)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
