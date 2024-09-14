import DataTable from '@/components/DataTable';
import { GridAPI } from '@/queries/grid.api';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CreateGridSheet } from '@/components/CreateGridSheet';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }
  const { data: grids, error } = await GridAPI.getAll(supabase, user.id);

  if (error) {
    console.error('Error fetching grids:', error.message);
    return <div>Error fetching grids</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Grids</h1>
      <div className="mb-4">
        <CreateGridSheet />
      </div>
      <DataTable data={grids} />
    </div>
  );
}
