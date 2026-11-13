'use client';

import { useDepartamentos } from '../hooks/use-schools';

interface Props {
  departamento: string;
  search: string;
  onDepartamentoChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function SchoolsFilters({ departamento, search, onDepartamentoChange, onSearchChange }: Props) {
  const { data: departamentos = [] } = useDepartamentos();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <label htmlFor="departamento" className="block text-xs font-medium text-gray-600">
          Departamento
        </label>
        <select
          id="departamento"
          value={departamento}
          onChange={(e) => onDepartamentoChange(e.target.value)}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Todos</option>
          {departamentos.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="search" className="block text-xs font-medium text-gray-600">
          Buscar por nombre o código
        </label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ej. Santa Ana o 10234"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
  );
}
