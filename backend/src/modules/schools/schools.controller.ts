import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { QuerySchoolsDto } from './dto/query-schools.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { SchoolsService } from './schools.service';

/**
 * La caché se aplica solo a las lecturas de este controlador (no global):
 * la respuesta es igual para cualquier usuario, a diferencia de /auth/me.
 */
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schools: SchoolsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  findMany(@Query() query: QuerySchoolsDto) {
    return this.schools.findMany(query);
  }

  @Get('departamentos')
  @UseInterceptors(CacheInterceptor)
  findDepartamentos() {
    return this.schools.findDepartamentos();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schools.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  updateMatricula(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatriculaDto,
  ) {
    return this.schools.updateMatricula(id, dto);
  }
}
