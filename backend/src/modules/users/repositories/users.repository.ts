import { User } from '../entities/user.entity';

/** Contrato de persistencia; la implementación actual usa JSON. */
export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findById(id: number): Promise<User | undefined>;
}
