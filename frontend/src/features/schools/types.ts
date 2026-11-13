export interface School {
  id: number;
  codigo: string;
  nombre: string;
  departamento: string;
  municipio: string;
  matricula: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface SchoolsQuery {
  page: number;
  limit: number;
  departamento?: string;
  q?: string;
}
