// export default function Page({ params }: { params: { gridId: string } }) {
//   return <div>My Post: {params.gridId}</div>;
// }

import ClientGrid from '@/components/ClientGrid';
import { GridProvider } from '@/context/GridContext';
import { GridAPI } from '@/queries/grid.api';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function GridPage({
  params,
}: {
  params: { gridId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { error } = await GridAPI.getOne(supabase, user.id, params.gridId);

  if (error) {
    return <div>Grid not found {error.message}</div>;
  }

  const { data: cellsData } = await GridAPI.getGridCells(
    supabase,
    params.gridId
  );
  const { data: rowAssignments } = await GridAPI.getGridRowAssignments(
    supabase,
    params.gridId
  );
  const { data: colAssignments } = await GridAPI.getGridColAssignments(
    supabase,
    params.gridId
  );

  if (!cellsData) {
    return <div>Grid not found</div>;
  }

  return (
    <GridProvider
      initialData={cellsData ?? []}
      initialRowAssignments={rowAssignments ?? []}
      initialColAssignments={colAssignments ?? []}
    >
      <ClientGrid />
    </GridProvider>
  );
}
