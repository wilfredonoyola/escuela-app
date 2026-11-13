import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schoolsApi } from '../api/schools.api';
import type { Paginated, School, SchoolsQuery } from '../types';

export const schoolsKeys = {
  all: ['schools'] as const,
  lists: () => [...schoolsKeys.all, 'list'] as const,
  list: (query: SchoolsQuery) => [...schoolsKeys.lists(), query] as const,
  departamentos: () => [...schoolsKeys.all, 'departamentos'] as const,
};

export const useSchools = (query: SchoolsQuery) =>
  useQuery({
    queryKey: schoolsKeys.list(query),
    queryFn: () => schoolsApi.list(query),
    placeholderData: keepPreviousData,
  });

export const useDepartamentos = () =>
  useQuery({
    queryKey: schoolsKeys.departamentos(),
    queryFn: schoolsApi.departamentos,
    staleTime: Infinity,
  });

export const useUpdateMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, matricula }: { id: number; matricula: number }) =>
      schoolsApi.updateMatricula(id, matricula),
    onSuccess: (updated) => {
      // Refleja el cambio de inmediato en las listas en caché (HU-05.3)…
      queryClient.setQueriesData<Paginated<School>>({ queryKey: schoolsKeys.lists() }, (old) =>
        old
          ? { ...old, data: old.data.map((s) => (s.id === updated.id ? updated : s)) }
          : old,
      );
      // …y revalida contra el servidor en segundo plano.
      void queryClient.invalidateQueries({ queryKey: schoolsKeys.lists() });
    },
  });
};
