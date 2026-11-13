import { Role } from '../../../common/enums/role.enum';

export interface User {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: Role;
}

/** Proyección segura: nunca incluye passwordHash (corrige HU-01.2). */
export type PublicUser = Omit<User, 'passwordHash'>;

export const toPublicUser = ({ id, nombre, email, rol }: User): PublicUser => ({
  id,
  nombre,
  email,
  rol,
});
