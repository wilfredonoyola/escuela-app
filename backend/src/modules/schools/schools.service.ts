import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { paginate, PaginatedResult } from '../../common/dto/paginated-result';
import { QuerySchoolsDto } from './dto/query-schools.dto';
import { SchoolResponseDto } from './dto/school-response.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { SchoolsRepository } from './repositories/schools.repository';

@Injectable()
export class SchoolsService {
  constructor(
    private readonly repository: SchoolsRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findMany(
    query: QuerySchoolsDto,
  ): Promise<PaginatedResult<SchoolResponseDto>> {
    const { page, limit, departamento, q } = query;
    const { items, total } = await this.repository.findMany({
      departamento,
      q,
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(
      items.map((s) => SchoolResponseDto.fromEntity(s)),
      total,
      page,
      limit,
    );
  }

  findDepartamentos(): Promise<string[]> {
    return this.repository.findDepartamentos();
  }

  async findOne(id: number): Promise<SchoolResponseDto> {
    const school = await this.repository.findById(id);
    if (!school)
      throw new NotFoundException(`Centro escolar ${id} no encontrado`);
    return SchoolResponseDto.fromEntity(school);
  }

  async updateMatricula(
    id: number,
    { matricula }: UpdateMatriculaDto,
  ): Promise<SchoolResponseDto> {
    const updated = await this.repository.updateMatricula(id, matricula);
    if (!updated)
      throw new NotFoundException(`Centro escolar ${id} no encontrado`);
    // Invalida las lecturas cacheadas para que el listado refleje el cambio (HU-05.3).
    // Solo se cachean lecturas de /schools, así que limpiar todo el store es seguro.
    await this.cache.clear();
    return SchoolResponseDto.fromEntity(updated);
  }
}
