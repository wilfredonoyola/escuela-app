import { Module } from '@nestjs/common';
import { JsonUsersRepository } from './repositories/json-users.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: JsonUsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
