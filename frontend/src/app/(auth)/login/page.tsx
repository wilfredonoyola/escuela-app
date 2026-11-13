import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';

export const metadata: Metadata = { title: 'Iniciar sesión · Directorio Escolar' };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">Directorio de Centros Escolares</h1>
        <p className="mb-6 text-sm text-gray-500">Ingresa con tu cuenta institucional</p>
        <LoginForm />
      </div>
    </main>
  );
}
