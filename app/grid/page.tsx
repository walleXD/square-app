import ClientGrid from '@/components/ClientGrid';
import { GridProvider } from '@/context/GridContext';
import { GridAPI } from '@/queries/grid.api';
import { createClient } from '@/utils/supabase/server';

export default async function GridPage() {
  const supabase = createClient();
  const { data, error } = await GridAPI.getAll(supabase);

  if (error) throw new Error(error.message);

  return (
    <GridProvider initialData={data}>
      <ClientGrid />
    </GridProvider>
  );
}
