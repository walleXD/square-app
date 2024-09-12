'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { Database } from '@/utils/generated/database.types';
import { shuffle } from '@/utils/utils';

// Define the type for a grid cell
type GridCell = Database['public']['Tables']['grid']['Row'];

// Define the type for the context value
interface GridContextType {
  gridData: GridCell[];
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleAssign: (id: number) => Promise<void>;
  handleRandomAssign: (bulkCount: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  bulkCount: number;
  setBulkCount: React.Dispatch<React.SetStateAction<number>>;
  handleReset: () => Promise<void>;
}

// Create the context with the correct type
const GridContext = createContext<GridContextType | null>(null);

export function GridProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: GridCell[];
}) {
  const [gridData, setGridData] = useState<GridCell[]>(initialData);
  const [name, setName] = useState('');
  const [bulkCount, setBulkCount] = useState<number>(1);
  const supabase = useSupabaseBrowser();

  const handleAssign = useCallback(
    async (id: number) => {
      if (!name) return;

      const { error } = await GridAPI.update(supabase, id, name);
      const { data } = await GridAPI.getAll(supabase);

      if (error) {
        console.error('Error updating cell:', error);
        return;
      }

      if (data) {
        setGridData(data);
        setName('');
      }
    },
    [name, supabase, setGridData]
  );
  const handleRandomAssign = useCallback(
    async (bulkCount: number = 1) => {
      const emptyCells = gridData.filter((cell) => !cell.name);
      if (emptyCells.length === 0) return;

      const cellsToAssign = shuffle(emptyCells).slice(0, bulkCount);
      const idsToAssign = cellsToAssign.map((cell) => cell.id);

      let error;
      if (idsToAssign.length === 1) {
        // Single assignment
        ({ error } = await GridAPI.update(supabase, idsToAssign[0], name));
      } else {
        // Bulk assignment
        ({ error } = await GridAPI.updateMany(supabase, idsToAssign, name));
      }

      if (error) {
        console.error('Error updating cell(s):', error);
        return;
      }

      const { data } = await GridAPI.getAll(supabase);
      if (data) {
        setGridData(data);
        setName('');
      }
    },
    [gridData, name, supabase]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const { error } = await GridAPI.update(supabase, id, null);
      const { data } = await GridAPI.getAll(supabase);

      if (error) {
        console.error('Error deleting cell:', error);
        return;
      }

      if (data) {
        setGridData(data);
      }
    },
    [supabase]
  );

  const handleReset = useCallback(async () => {
    const { error } = await GridAPI.resetAll(supabase);
    if (error) {
      console.error('Error resetting grid:', error);
      return;
    }

    const { data } = await GridAPI.getAll(supabase);
    if (data) {
      setGridData(data);
      setBulkCount(1);
      setName('');
    }
  }, [supabase]);

  const contextValue: GridContextType = {
    gridData,
    name,
    setName,
    bulkCount,
    setBulkCount,
    handleAssign,
    handleRandomAssign,
    handleDelete,
    handleReset,
  };

  return (
    <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>
  );
}

export const useGridContext = (): GridContextType => {
  const context = useContext(GridContext);
  if (context === null) {
    throw new Error('useGridContext must be used within a GridProvider');
  }
  return context;
};
