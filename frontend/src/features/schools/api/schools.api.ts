import { apiRequest } from '@/shared/lib/api-client';
import type { Paginated, School, SchoolsQuery } from '../types';

const toSearchParams = (query: SchoolsQuery) => {
  const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
  if (query.departamento) params.set('departamento', query.departamento);
  if (query.q) params.set('q', query.q);
  return params.toString();
};

export const schoolsApi = {
  list: (query: SchoolsQuery) => apiRequest<Paginated<School>>(`/schools?${toSearchParams(query)}`),
  departamentos: () => apiRequest<string[]>('/schools/departamentos'),
  updateMatricula: (id: number, matricula: number) =>
    apiRequest<School>(`/schools/${id}`, { method: 'PATCH', body: { matricula } }),
};
