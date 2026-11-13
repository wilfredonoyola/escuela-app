import { School } from '../entities/school.entity';

/**
 * Lo único que sale por el API. Excluye datos personales del director,
 * observaciones internas y metadatos de auditoría (corrige HU-03.2).
 */
export class SchoolResponseDto {
  id!: number;
  codigo!: string;
  nombre!: string;
  departamento!: string;
  municipio!: string;
  matricula!: number;

  static fromEntity(school: School): SchoolResponseDto {
    const { id, codigo, nombre, departamento, municipio, matricula } = school;
    return { id, codigo, nombre, departamento, municipio, matricula };
  }
}
