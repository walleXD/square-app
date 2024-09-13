'use client';

import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import useSupabaseBrowser from '@/utils/supabase/client';
import { GridAPI } from '@/queries/grid.api';
import { useState } from 'react';

export default function Squares() {
  const supabase = useSupabaseBrowser();
  const [name, setName] = useState<string>('');
  const { data, error, isLoading } = useQuery(GridAPI.getAll(supabase));

  const { mutate: updateCell } = useUpdateMutation(
    supabase.from('grid'),
    ['id'],
    'name'
  );

  const handleAssign = (id: number) => {
    updateCell(
      { id, name },
      {
        onSuccess: () => {
          setName('');
        },
      }
    );
  };

  const assignRandomCell = () => {
    const emptyCells = data!.filter((cell) => !cell.name);
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      handleAssign(randomCell.id);
    } else {
      alert('Not enough empty cells available!');
    }
  };

  const setCellToNull = (id: number) => {
    updateCell(
      { id, name: null },
      {
        onSuccess: () => {
          console.log('Successfully set cell to null', id);
        },
      }
    );
  };

  if (isLoading)
    return <p className="text-center text-gray-600">Loading grid...</p>;
  if (error)
    return <p className="text-center text-red-600">Error: {error.message}</p>;

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">10x10 Grid</h1>
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border p-2 rounded"
        />
        <button
          onClick={assignRandomCell}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Assign Name to Random Cell
        </button>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {data?.map((cell) => (
          <div
            key={`${cell.row}-${cell.col}`}
            className="relative aspect-square w-20 bg-white border border-gray-200 rounded shadow flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
          >
            {cell.name || ''}
            {!cell.name && (
              <button
                onClick={() => handleAssign(cell.id)}
                className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
              >
                Assign
              </button>
            )}
            {cell.name && (
              <button
                onClick={() => setCellToNull(cell.id)}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
