import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonFileReader } from '../../../infrastructure/json-data/json-file.reader';
import { School } from '../entities/school.entity';
import { SchoolFilters, SchoolsRepository } from './schools.repository';

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Datos en memoria cargados desde data/schools.json al iniciar.
 * Los cambios no se escriben de vuelta al archivo (se pierden al reiniciar).
 */
@Injectable()
export class JsonSchoolsRepository
  extends SchoolsRepository
  implements OnModuleInit
{
  private schools = new Map<number, School>();

  constructor(private readonly reader: JsonFileReader) {
    super();
  }

  async onModuleInit(): Promise<void> {
    const rows = await this.reader.read<School[]>('schools.json');
    this.schools = new Map(rows.map((school) => [school.id, school]));
  }

  findMany({ departamento, q, skip, take }: SchoolFilters) {
    const term = q ? normalize(q) : undefined;
    const filtered = [...this.schools.values()]
      .filter((s) => !departamento || s.departamento === departamento)
      .filter(
        (s) =>
          !term ||
          normalize(s.nombre).includes(term) ||
          s.codigo.includes(term),
      )
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    return Promise.resolve({
      items: filtered.slice(skip, skip + take),
      total: filtered.length,
    });
  }

  findById(id: number) {
    return Promise.resolve(this.schools.get(id));
  }

  findDepartamentos() {
    const unique = new Set(
      [...this.schools.values()].map((s) => s.departamento),
    );
    return Promise.resolve(
      [...unique].sort((a, b) => a.localeCompare(b, 'es')),
    );
  }

  updateMatricula(id: number, matricula: number) {
    const school = this.schools.get(id);
    if (!school) return Promise.resolve(undefined);
    const updated = { ...school, matricula };
    this.schools.set(id, updated);
    return Promise.resolve(updated);
  }
}
