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

type GridRow = Tables<'grids'>;

interface DataTableProps {
  data: GridRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Columns</TableHead>
          <TableHead>Rows</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((grid) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
