'use client';

import { useDeferredValue, useState } from 'react';
import { useAuth } from '@/features/auth';
import { useSchools } from '../hooks/use-schools';
import { PaginationControls } from './pagination-controls';
import { SchoolsFilters } from './schools-filters';
import { SchoolsTable } from './schools-table';

const PAGE_SIZE = 10;

export function SchoolsView() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [departamento, setDepartamento] = useState('');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isPending, isError, error, isFetching } = useSchools({
    page,
    limit: PAGE_SIZE,
    departamento: departamento || undefined,
    q: deferredSearch || undefined,
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Centros escolares</h1>
        {isFetching && !isPending && <span className="text-xs text-gray-400">Actualizando…</span>}
      </div>

      <SchoolsFilters
        departamento={departamento}
        search={search}
        onDepartamentoChange={(value) => {
          setDepartamento(value);
          setPage(1);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {isPending && <p className="py-8 text-center text-sm text-gray-500">Cargando centros…</p>}
      {isError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}
      {data && (
        <>
          <SchoolsTable schools={data.data} canEdit={isAdmin} />
          <PaginationControls
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
