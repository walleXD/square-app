import { TypedSupabaseClient } from '@/utils/types';

export const GridAPI = {
  getAll: (client: TypedSupabaseClient) => {
    return client
      .from('grid')
      .select('*')
      .order('row', { ascending: true })
      .order('col', { ascending: true });
  },
  resetAll: (client: TypedSupabaseClient) => {
    return client.from('grid').update({ name: null }).neq('name', null);
  },
  update: (client: TypedSupabaseClient, id: number, name: string | null) => {
    return client.from('grid').update({ name }).eq('id', id);
  },
  updateMany: (
    client: TypedSupabaseClient,
    ids: number[],
    name: string | null
  ) => {
    return client.from('grid').update({ name }).in('id', ids);
  },
};
