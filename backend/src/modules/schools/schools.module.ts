import { Module } from '@nestjs/common';
import { JsonSchoolsRepository } from './repositories/json-schools.repository';
import { SchoolsRepository } from './repositories/schools.repository';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

@Module({
  controllers: [SchoolsController],
  providers: [
    SchoolsService,
    { provide: SchoolsRepository, useClass: JsonSchoolsRepository },
  ],
})
export class SchoolsModule {}
