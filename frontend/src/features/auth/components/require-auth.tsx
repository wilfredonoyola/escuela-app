'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/auth-context';

/** Protege rutas del lado del cliente; la autorización real la hace el API. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status !== 'authenticated') {
    return <p className="p-8 text-center text-sm text-gray-500">Cargando sesión…</p>;
  }
  return <>{children}</>;
}
