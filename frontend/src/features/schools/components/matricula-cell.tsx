'use client';

import { useState, type FormEvent } from 'react';
import { ApiError } from '@/shared/lib/api-client';
import { useUpdateMatricula } from '../hooks/use-schools';
import { matriculaSchema } from '../schemas/matricula.schema';
import type { School } from '../types';

interface Props {
  school: School;
  canEdit: boolean;
}

export function MatriculaCell({ school, canEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(school.matricula));
  const [error, setError] = useState<string | null>(null);
  const mutation = useUpdateMatricula();

  const formatted = school.matricula.toLocaleString('es-SV');

  if (!editing) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="tabular-nums">{formatted}</span>
        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setValue(String(school.matricula));
              setError(null);
              setEditing(true);
            }}
            className="text-xs text-blue-600 hover:underline"
            aria-label={`Editar matrícula de ${school.nombre}`}
          >
            Editar
          </button>
        )}
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = matriculaSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Valor inválido');
      return;
    }
    mutation.mutate(
      { id: school.id, matricula: parsed.data },
      {
        onSuccess: () => setEditing(false),
        onError: (err) =>
          setError(err instanceof ApiError ? err.message : 'No se pudo guardar'),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Nueva matrícula"
          aria-invalid={Boolean(error)}
          className="w-24 rounded border border-gray-300 px-2 py-1 text-right"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white disabled:opacity-50"
        >
          {mutation.isPending ? '…' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded border border-gray-300 px-2 py-1 text-xs"
        >
          Cancelar
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
