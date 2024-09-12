'use client';

import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReactQueryClientProvider>{children}</ReactQueryClientProvider>;
}
