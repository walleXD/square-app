import ClientGrid from '@/components/ClientGrid';
import Squares from '@/components/squares';
import { GridProvider } from '@/context/GridContext';
import { GridAPI } from '@/queries/grid.api';
import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }
  const { data, error } = await GridAPI.getAll(supabase);

  if (error) throw new Error(error.message);

  return (
    <div className=''>
      <GridProvider initialData={data}>
        <ClientGrid />
      </GridProvider>
    </div>
  );
}
