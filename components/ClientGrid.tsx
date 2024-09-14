'use client';

import { useGridContext } from '@/context/GridContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter } from './ui/card';
import clsx from 'clsx';

export default function ClientGrid() {
  const {
    gridData,
    name,
    setName,
    bulkCount,
    setBulkCount,
    handleAssign,
    handleRandomAssign,
    handleDelete,
    handleReset,
  } = useGridContext();

  return (
    <div className="mx-auto pt-4 space-y-4">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-end">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="border p-2 rounded"
          />
        </div>
        <div className="grid w-full max-w-20 items-center gap-1.5">
          <Label htmlFor="bulkCount"># Squares</Label>
          <Input
            type="number"
            id="bulkCount"
            value={bulkCount}
            onChange={(e) => setBulkCount(Number(e.target.value))}
            placeholder="Enter bulk count"
            className="border p-2 rounded"
          />
        </div>
        <Button
          variant={'default'}
          disabled={!name}
          onClick={() => handleRandomAssign(bulkCount)}
        >
          Assign Name to Random Cell
        </Button>
        <Button variant={'destructive'} onClick={handleReset}>
          Reset Grid
        </Button>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {gridData.map((cell) => (
          <Card
            key={`${cell.row}-${cell.col}`}
            className={clsx({
              'bg-green-400 border-green-600': cell.name,
            })}
          >
            <CardContent>{cell.name || ''}</CardContent>
            <CardFooter>
              {cell.name ? (
                <Button
                  variant={'destructive'}
                  size={'sm'}
                  onClick={() => handleDelete(cell.uuid as string)}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  size={'sm'}
                  disabled={!name}
                  onClick={() => handleAssign(cell.uuid as string)}
                >
                  Assign
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
