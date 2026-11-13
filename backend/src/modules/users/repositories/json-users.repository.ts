import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonFileReader } from '../../../infrastructure/json-data/json-file.reader';
import { User } from '../entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JsonUsersRepository
  extends UsersRepository
  implements OnModuleInit
{
  private users: User[] = [];

  constructor(private readonly reader: JsonFileReader) {
    super();
  }

  async onModuleInit(): Promise<void> {
    this.users = await this.reader.read<User[]>('users.json');
  }

  findByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    return Promise.resolve(
      this.users.find((u) => u.email.toLowerCase() === normalized),
    );
  }

  findById(id: number): Promise<User | undefined> {
    return Promise.resolve(this.users.find((u) => u.id === id));
  }
}
