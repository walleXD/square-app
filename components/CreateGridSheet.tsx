'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { GridAPI } from '@/queries/grid.api';
import { useRouter } from 'next/navigation';
import useSupabaseBrowser from '@/utils/supabase/client';

export function CreateGridSheet() {
  const [open, setOpen] = useState(false);
  const [gridName, setGridName] = useState('');
  const [numCols, setNumCols] = useState(10);
  const [numRows, setNumRows] = useState(10);
  const router = useRouter();
  const supabase = useSupabaseBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await GridAPI.addGrid(
      supabase,
      user.id,
      gridName,
      numCols,
      numRows
    );

    if (error) {
      console.error('Error creating grid:', error);
      return;
    }

    const newGridId = data.uuid;

    const { error: cellsError } = await GridAPI.createGridCells(
      supabase,
      newGridId!,
      numCols,
      numRows
    );

    if (cellsError) {
      console.error('Error creating grid cells:', cellsError);
      return;
    }

    setOpen(false);
    router.push(`/protected/${newGridId}`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Create New Grid</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Grid</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="gridName">Grid Name</Label>
            <Input
              id="gridName"
              value={gridName}
              onChange={(e) => setGridName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="numCols">Number of Columns</Label>
            <Input
              id="numCols"
              type="number"
              value={numCols}
              onChange={(e) => setNumCols(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="numRows">Number of Rows</Label>
            <Input
              id="numRows"
              type="number"
              value={numRows}
              onChange={(e) => setNumRows(Number(e.target.value))}
              required
            />
          </div>
          <Button type="submit">Create Grid</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
