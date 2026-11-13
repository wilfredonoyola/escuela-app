import { School } from '../entities/school.entity';

export interface SchoolFilters {
  departamento?: string;
  q?: string;
  skip: number;
  take: number;
}

/** Contrato de persistencia; filtros y paginación se resuelven en la fuente de datos. */
export abstract class SchoolsRepository {
  abstract findMany(
    filters: SchoolFilters,
  ): Promise<{ items: School[]; total: number }>;
  abstract findById(id: number): Promise<School | undefined>;
  abstract findDepartamentos(): Promise<string[]>;
  abstract updateMatricula(
    id: number,
    matricula: number,
  ): Promise<School | undefined>;
}
