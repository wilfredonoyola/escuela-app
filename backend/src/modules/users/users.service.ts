import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findByEmail(email);
  }

  findById(id: number): Promise<User | undefined> {
    return this.repository.findById(id);
  }
}
