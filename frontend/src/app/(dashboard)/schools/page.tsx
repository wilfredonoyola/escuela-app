import type { Metadata } from 'next';
import { SchoolsView } from '@/features/schools';

export const metadata: Metadata = { title: 'Centros escolares · Directorio Escolar' };

export default function SchoolsPage() {
  return <SchoolsView />;
}
