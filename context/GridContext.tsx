'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { shuffle } from '@/utils/utils';
import { Database } from '@/utils/generated/database.types';

type GridCell = Database['public']['Tables']['grid_cells']['Row'];
type RowAssignment =
  Database['public']['Tables']['grid_row_assignments']['Row'];
type ColAssignment =
  Database['public']['Tables']['grid_col_assignments']['Row'];

interface GridContextType {
  gridData: GridCell[];
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleAssign: (id: string) => Promise<void>;
  handleRandomAssign: (bulkCount: number) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  bulkCount: number;
  setBulkCount: React.Dispatch<React.SetStateAction<number>>;
  handleReset: () => Promise<void>;
  rowAssignments: RowAssignment[];
  colAssignments: ColAssignment[];
  handleGenerateAssignments: () => Promise<void>;
  //   areAssignmentsGenerated: boolean;
}

// Create the context with the correct type
const GridContext = createContext<GridContextType | null>(null);

export function GridProvider({
  children,
  initialData,
  initialRowAssignments,
  initialColAssignments,
}: {
  children: React.ReactNode;
  initialData: GridCell[];
  initialRowAssignments: RowAssignment[];
  initialColAssignments: ColAssignment[];
}) {
  const [gridData, setGridData] = useState<GridCell[]>(initialData);
  const [name, setName] = useState('');
  const [bulkCount, setBulkCount] = useState<number>(1);
  const [rowAssignments, setRowAssignments] = useState<RowAssignment[]>(
    initialRowAssignments
  );
  const [colAssignments, setColAssignments] = useState<ColAssignment[]>(
    initialColAssignments
  );

  const supabase = useSupabaseBrowser();

  const handleAssign = useCallback(
    async (id: string) => {
      if (!name) return;

      const { error } = await GridAPI.update(
        supabase,
        gridData[0].grid_id!,
        id,
        name
      );
      const { data } = await GridAPI.getGridCells(
        supabase,
        gridData[0].grid_id!
      );

      if (error) {
        console.error('Error updating cell:', error);
        return;
      }

      if (data) {
        setGridData(data);
        setName('');
      }
    },
    [name, supabase, setGridData, gridData]
  );
  const handleRandomAssign = useCallback(
    async (bulkCount: number = 1) => {
      const emptyCells = gridData.filter((cell) => !cell.name);
      if (emptyCells.length === 0) return;

      const cellsToAssign = shuffle(emptyCells).slice(0, bulkCount);
      const idsToAssign = cellsToAssign.map((cell) => cell.uuid) as string[];

      let error;
      if (idsToAssign.length === 1) {
        // Single assignment
        ({ error } = await GridAPI.update(
          supabase,
          gridData[0].grid_id!,
          idsToAssign[0],
          name
        ));
      } else {
        // Bulk assignment
        ({ error } = await GridAPI.updateMany(
          supabase,
          gridData[0].grid_id!,
          idsToAssign,
          name
        ));
      }

      if (error) {
        console.error('Error updating cell(s):', error);
        return;
      }

      const { data } = await GridAPI.getGridCells(
        supabase,
        gridData[0].grid_id!
      );
      if (data) {
        setGridData(data);
        setName('');
      }
    },
    [gridData, name, supabase]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const { error } = await GridAPI.update(
        supabase,
        gridData[0].grid_id!,
        id,
        null
      );

      const { data } = await GridAPI.getGridCells(
        supabase,
        gridData[0].grid_id!
      );

      if (error) {
        console.error('Error deleting cell:', error);
        return;
      }

      if (data) {
        setGridData(data);
      }
    },
    [supabase, gridData, setGridData]
  );

  const handleReset = useCallback(async () => {
    const { error } = await GridAPI.resetAll(supabase, gridData[0].grid_id!);
    if (error) {
      console.error('Error resetting grid:', error);
      return;
    }

    const { data } = await GridAPI.getGridCells(supabase, gridData[0].grid_id!);

    if (data) {
      setGridData(data);
      setBulkCount(1);
      setName('');
    }
  }, [supabase, gridData, setGridData, setBulkCount, setName]);

  const handleGenerateAssignments = useCallback(async () => {
    const { error: rowError } = await GridAPI.createGridRowAssignments(
      supabase,
      gridData[0].grid_id!,
      10
    );

    if (rowError) {
      console.error('Error creating grid row assignments:', rowError);
      return;
    }

    const { error: colError } = await GridAPI.createGridColAssignments(
      supabase,
      gridData[0].grid_id!,
      10
    );

    if (colError) {
      console.error('Error creating grid col assignments:', colError);
      return;
    }

    const { data: rowData } = await GridAPI.getGridRowAssignments(
      supabase,
      gridData[0].grid_id!
    );

    const { data: colData } = await GridAPI.getGridColAssignments(
      supabase,
      gridData[0].grid_id!
    );

    if (rowData && colData) {
      setRowAssignments(rowData);
      setColAssignments(colData);
    }
  }, [supabase, gridData]);

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
    rowAssignments,
    colAssignments,
    handleGenerateAssignments,
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
