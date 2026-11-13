import type { ReactNode } from 'react';
import { RequireAuth } from '@/features/auth';
import { AppHeader } from './_components/app-header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </RequireAuth>
  );
}
