'use client';

import { useGridContext } from '@/context/GridContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter } from './ui/card';
import clsx from 'clsx';
import { Skeleton } from './ui/skeleton';
import { Fragment } from 'react';

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
    handleGenerateAssignments,
    rowAssignments,
    colAssignments,
  } = useGridContext();

  const colHeaders = Array.from({ length: 10 }, (_, i) => i);
  const rowHeaders = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="mx-auto pt-4 space-y-4">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-end">
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
        <Button
          variant={'default'}
          onClick={handleGenerateAssignments}
          disabled={rowAssignments.length > 0 && colAssignments.length > 0}
        >
          Generate Assignments
        </Button>
      </div>
      <div className="grid grid-cols-[auto_repeat(10,1fr)] gap-2">
        <div className="col-span-1"></div>
        {colHeaders.map((col) => (
          <div key={col} className="">
            {colAssignments ? (
              <div className="w-full h-8 flex items-center justify-center bg-secondary text-secondary-foreground font-bold">
                {colAssignments
                  .find((assignment) => assignment.col === col)
                  ?.value.toString() || ''}
              </div>
            ) : (
              <Skeleton className="w-full h-8" />
            )}
          </div>
        ))}
        {rowHeaders.map((row) => (
          <Fragment key={`row-${row}`}>
            <div className="">
              {rowAssignments ? (
                <div className="w-8 h-full flex items-center justify-center bg-secondary text-secondary-foreground font-bold">
                  {rowAssignments
                    .find((assignment) => assignment.row === row)
                    ?.value.toString() || ''}
                </div>
              ) : (
                <Skeleton className="w-8 h-full" />
              )}
            </div>
            {gridData.slice(row * 10, (row + 1) * 10).map((cell) => (
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
          </Fragment>
        ))}
      </div>
    </div>
  );
}
